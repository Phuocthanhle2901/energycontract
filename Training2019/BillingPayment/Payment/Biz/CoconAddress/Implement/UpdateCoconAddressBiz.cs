using Cifw.Core.Constants;
using Cifw.Core.Exceptions;
using Cifw.Core.Logging;
using Cifw.Core.Mailing;
using Cifw.Core.Patterns.Retry;
using CifwCocon.Entities.Models;
using CifwCocon.Repositories;
using CoconService;
using Microsoft.Extensions.Configuration;
using Payment.Biz.CircuitBreaker;
using Payment.Biz.Interface;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.ServiceModel;
using System.ServiceModel.Security;
using System.Xml.Serialization;

namespace Payment.Biz
{
    public enum StatusOfPayment
    {
        AcceptUpdateEntity = 1
    }

    public class UpdateCoconAddressBiz : IUpdateCoconAddressBiz
    {
        private UnitOfWork _uow;

        private ILogger _logger;        

        private IConfiguration _config;

        private CoconConfigurationBiz _coconConfig;

        private RetryMachine _retryMachine;

        private UpdateEntityAdapterMachine _adapterMachine;

        private readonly IMailing _mailing;

        public UpdateCoconAddressBiz(UnitOfWork uow, IConfiguration config, ILogger logger
            , CoconConfigurationBiz coconConfigurationBiz, UpdateEntityAdapterMachine adapterMachine, RetryMachine retryMachine, IMailing mailing)
        {
            _uow = uow;

            _config = config;

            _logger = logger;

            _coconConfig = coconConfigurationBiz;

            _adapterMachine = adapterMachine;

            _retryMachine = retryMachine;

            _mailing = mailing;
        }
                
        public void UpdateCoconAddressForStatusPayment()
        {
            var coconAddresses = GetCoconAddress();
            
            if(coconAddresses.Count() > 0)
            {
                foreach(var item in coconAddresses)
                {                    
                    var tags = new Dictionary<string, string>()
                    {
                        { "ZipCode", item.Zipcode},
                        { "HouseNumber", item.HouseNumber.ToString() },
                        { "HouseNumberSuffix", item.HousenumberExt },
                        { "Room", item.Room }
                    };

                    _logger.SetAdditionalCorrelations(tags);

                    if (item.StatusOfPayment == (int)StatusOfPayment.AcceptUpdateEntity && item.UpdateEntitySuccess == null)
                        //call update entity
                        UpdateStatusOfPayment(item);
                    else if(item.StatusOfPayment != (int)StatusOfPayment.AcceptUpdateEntity)
                    {
                        string errorMessage = string.Format("Item not write to Cocon with status of payment {0}", item.StatusOfPayment);
                        _logger.Warn(errorMessage);

                        //log to db 
                        item.NoteAfterUpdateEntity = errorMessage;                        
                        UpdateCoconAddressAfterUpdateEntity(item);
                    }
                        
                }
            }
        }

        private List<CoconBillingAddress> GetCoconAddress()
        {
            return _uow.CoconBillingAddressRepository.GetAll();
        }

        /// <summary>
        /// Update status Payment
        /// </summary>
        /// <param name="item">CoconAddress in table local cache</param>
        private void UpdateStatusOfPayment(CoconBillingAddress item)
        {
            var coconConfiguration = _coconConfig.GetCoconConfiguration();
            var retryConfiguration = _coconConfig.GetRetryConfiguration();         
            var soapClient = _config["BasicHttpSecurityMode"] == "Http" ?
                            new CRUDSoapClient(new BasicHttpBinding(BasicHttpSecurityMode.None), new EndpointAddress(coconConfiguration.EndPoint)) :
                            new CRUDSoapClient(CRUDSoapClient.EndpointConfiguration.CRUDSoap12, coconConfiguration.EndPoint);

            soapClient.ChannelFactory.Credentials.ServiceCertificate.SslCertificateAuthentication = new X509ServiceCertificateAuthentication
            {
                CertificateValidationMode = X509CertificateValidationMode.None,
                RevocationMode = X509RevocationMode.NoCheck
            };
            soapClient.ChannelFactory.Credentials.ServiceCertificate.Authentication.CertificateValidationMode = X509CertificateValidationMode.None;
            soapClient.ClientCredentials.ServiceCertificate.Authentication.CertificateValidationMode = X509CertificateValidationMode.None;

            _logger.Info("Begin Update Entity In Biz");
            _logger.Debug("Begin Update Entity with params");

            #region request update entity to real cocon
            var fieldConditions = new List<FieldValue>();
            fieldConditions.Add(new FieldValue
            {
                Value = item.Zipcode,
                Field = "ADDRESS.ZIPCODE"
            });

            fieldConditions.Add(new FieldValue
            {
                Value = item.HouseNumber,
                Field = "ADDRESS.HOUSENR"
            });

            fieldConditions.Add(new FieldValue
            {
                Value = item.HousenumberExt,
                Field = "ADDRESS.HOUSENR_SUFFIX"
            });

            fieldConditions.Add(new FieldValue
            {
                Value = item.Room,
                Field = "ADDRESS.ROOM"
            });

            var fieldSetValue = new List<FieldValue>();

            //TODO: check bussiness when we will set status N or M
            //item.StatusOfPayment == 1 ? "R" : "N";
            var fixChargeStatus = "R";
            fieldSetValue.Add(new FieldValue
            {
                Value = fixChargeStatus,
                Field = "ADDRESS.FIXEDCHARGE_STATUS"
            });
            _logger.Info("Set fixChargeStatus Cocon request: " + fixChargeStatus);
            //TODO: check soap endpoints
            
            try
            {                
                using (new OperationContextScope(soapClient.InnerChannel))
                {
                    var response = soapClient.UpdateEntityAsync(
                        coconConfiguration.CentralCoconFolder,
                        coconConfiguration.Environment,
                        coconConfiguration.UserName,
                        coconConfiguration.Password,
                        coconConfiguration.Culture,
                        "ADDRESS",
                        fieldConditions.ToArray(),
                        fieldSetValue.ToArray()
                    );
                                  
                    WriteLogResponse(response.Result);
                    if (response.IsCompletedSuccessfully)
                    {
                        item.NoteAfterUpdateEntity = "Update Success";
                        item.UpdateEntitySuccess = true;
                        UpdateCoconAddressAfterUpdateEntity(item);
                        _logger.Info("Update entity cocon successfully In Biz With Status Payment: " + fixChargeStatus);
                    }                        
                }                    
            }            
            catch (Exception ex)
            {                
                if (typeof(EndpointNotFoundException).IsInstanceOfType(ex.InnerException))
                {
                    //for case wrong endpoint 
                    item.NoteAfterUpdateEntity = ex.InnerException.Message;
                }
                else
                {
                    item.NoteAfterUpdateEntity = ex.InnerException.Message;
                    item.UpdateEntitySuccess = false;
                }                
                UpdateCoconAddressAfterUpdateEntity(item);

                var destinationMail = _config["MailConfig:to"];
                if (!string.IsNullOrEmpty(destinationMail))
                {
                    var mailSubject = string.Format("Update Entity failed for {0}-{1}-{2}-{3}", item.Zipcode, item.HouseNumber, item.HousenumberExt, item.Room);
                    var body = string.Format(CoconConstants.EmailTemplateSendForUpdateEntityRecordUpdatePayment, ex.InnerException.Message);
                    _mailing.SendAsync(destinationMail, mailSubject, body);                    
                }                
                _logger.Debug("Update entity cocon In Biz failed! ", ex);
            }
            

            #endregion
        }

        private void WriteLogResponse(object item)
        {
            XmlSerializer xmlSerialize = new XmlSerializer(item.GetType());
            TextWriter textWriter = new StringWriter();
            xmlSerialize.Serialize(textWriter, item);
            _logger.Debug("Response result: " + textWriter.ToString());            
        }

        /// <summary>
        /// Update item billing after update entity success
        /// </summary>
        /// <param name="item"></param>
        private void UpdateCoconAddressAfterUpdateEntity(CoconBillingAddress item)
        {
            _logger.Info("Begin update CoconBillingAddress! ");
            _uow.CoconBillingAddressRepository.Update(item);
            _logger.Info("End update CoconBillingAddress. ");
        }
    }
}
