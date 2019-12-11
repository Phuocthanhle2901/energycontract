using AutoMapper;
using Cifw.Core.Exceptions;
using IFD.Logging;
using CifwCocon.NetworkInformation.Bo;
using Microsoft.Extensions.Configuration;
using System;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Security;
using CifwCocon.NetworkInformation.Bo.IntegrationEvents.Events;

namespace CifwCocon.NetworkInformation.Biz
{
    public class OrderCoconBiz
    {
        private ILogger _logger;
        private IMapper _mapper;
        private IConfiguration _config;
        private CoconConfigurationBiz _coconConfig;
        private readonly CoconAddressBiz _coconAddressBiz;

        public OrderCoconBiz(ILogger logger, IConfiguration config, IMapper mapper, CoconConfigurationBiz coconConfig, CoconAddressBiz coconAddressBiz)
        {
            _logger = logger;
            _config = config;
            _mapper = mapper;
            _coconConfig = coconConfig;
            _coconAddressBiz = coconAddressBiz;
        }

        /// <exception cref="SettingException"></exception>
        /// <exception cref="ExternalSystemException"></exception>
        /// <exception cref="ChangeDevicePortException"></exception>
        public void WritePatchDataToCoCon(string postcode,
           string huisnr, string vezelnummer, string apparatuurpoortIdentificatie,
           string toevoeging, string kamernr, string orderId, DateTime orderDate, string OrderType, string activeOperator)
        {
            var config = _coconConfig.GetCoconConfiguration();
            var userId = config.UserWP;
            var pwd = config.PassWordWP;
            var culture = config.CultureWP;
            var centralCoconFolder = config.CentralCoconFolderWP;


            var ftthUser = new FtthUser
            {
                CentralCoconFolder = centralCoconFolder,
                Environment = string.Empty,
                UserName = userId,
                Password = pwd,
                Culture = culture
            };

            int houseNo = 0;
            int.TryParse(huisnr, out houseNo);
            int fiberNo = 0;
            int.TryParse(vezelnummer, out fiberNo);
            var ftthAddress = new FtthAdress
            {
                ZipCode = postcode,
                HouseNumber = houseNo,
                HouseNumberExtension = toevoeging,
                Room = kamernr,
                Fiber = fiberNo,
                DevicePort = apparatuurpoortIdentificatie,
                OrderType = OrderType,
                OrderId = orderId,
                OrderDate = orderDate,
                ActiveOperator = activeOperator,
                RequestUser = ftthUser.UserName
            };

            ChangePortService(ftthUser, ftthAddress);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="ftthUser"></param>
        /// <param name="ftthAddress"></param>
        /// <exception cref="SettingException"></exception>
        /// <exception cref="ExternalSystemException"></exception>
        /// <exception cref="ChangeDevicePortException"></exception>
        public void ChangePortService(FtthUser ftthUser, FtthAdress ftthAddress)
        {
            try
            {
                var config = _coconConfig.GetCoconConfiguration();

                var soapClient = new FTTHManagementService.FTTHManagementSoapClient(FTTHManagementService.FTTHManagementSoapClient.EndpointConfiguration.FTTHManagementSoap);

                soapClient.ChannelFactory.Credentials.ServiceCertificate.SslCertificateAuthentication = new X509ServiceCertificateAuthentication
                {
                    CertificateValidationMode = X509CertificateValidationMode.None,
                    RevocationMode = X509RevocationMode.NoCheck
                };
                soapClient.ChannelFactory.Credentials.ServiceCertificate.Authentication.CertificateValidationMode = X509CertificateValidationMode.None;
                soapClient.ClientCredentials.ServiceCertificate.Authentication.CertificateValidationMode = X509CertificateValidationMode.None;

                soapClient.Endpoint.Address = new System.ServiceModel.EndpointAddress(config.EndPointPxq);
                //Login
                _logger.LogException(NimFiberLoggingEnum.NFI0032);
                using (new OperationContextScope(soapClient.InnerChannel))
                {
                    var correlationId = _logger.GetCorrelationId();
                    var messageId = _logger.GetMessageId();
                    HttpRequestMessageProperty requestMessage = new HttpRequestMessageProperty();
                    requestMessage.Headers["X-Request-ID"] = correlationId;
                    requestMessage.Headers["X-Message-ID"] = messageId;

                    OperationContext.Current.OutgoingMessageProperties[HttpRequestMessageProperty.Name] = requestMessage;
                    soapClient.LoginAsync(ftthUser.CentralCoconFolder, ftthUser.Environment, ftthUser.UserName,
                    ftthUser.Password, ftthUser.Culture).Wait();

                    //Change device port
                    _logger.LogException(NimFiberLoggingEnum.NFI0033);

                    soapClient.ChangeDevicePortV2Async(ftthAddress.ZipCode, ftthAddress.HouseNumber,
                            ftthAddress.HouseNumberExtension
                            , ftthAddress.Room, ftthAddress.Fiber, ftthAddress.DevicePort, ftthAddress.OrderType
                            , ftthAddress.OrderId, ftthAddress.OrderDate, ftthAddress.RequestUser, ftthAddress.ActiveOperator ?? "").Wait();

                    //Logout
                    _logger.LogException(NimFiberLoggingEnum.NFI0034);
                    soapClient.LogoutAsync().Wait();
                }
            }
            catch (AggregateException ex)
            {
                if (typeof(FaultException).IsInstanceOfType(ex.InnerExceptions[0]))
                {
                    throw new WritePatchBizException("ChangeDevicePort failed, FTTH003: " + ex.Message);
                }

                throw new ExternalSystemException("FtthManagement service does not work. Cif will retry later, FTTH002 ", ex);
            }
            catch (FaultException ex)
            {
                throw new WritePatchBizException("ChangeDevicePort failed, FTTH003: " + ex.Message);
            }
            catch (TimeoutException ex)
            {
                throw new ExternalSystemException("FtthManagement service does not work.Cif will retry later, FTTH002 ", ex);
            }
            catch (CommunicationException ex)
            {
                throw new ExternalSystemException("FtthManagement service does not work.Cif will retry later, FTTH002 ", ex);
            }
            catch (WebException ex)
            {
                throw new ExternalSystemException("FtthManagement service does not work.Cif will retry later, FTTH002 ", ex);
            }
            catch (Exception ex)
            {
                throw new ExternalSystemException("FtthManagement service does not work. Cif will retry later, FTTH002 ", ex);
            }
        }

        /// <summary>
        /// Add routing for update local cache
        /// Just add routing case fiberId has value
        /// </summary>
        /// <param name="event"></param>
        public void AddFiberAddressInfo(UpdateLocalCacheByPatchIntegrationEvent @event)
        {
            try
            {
                if (@event.Fiber == 0) return;
                var fiberCode = (Cifw.Core.Enums.CoconEnum.FiberEnum)@event.Fiber;
                var coconData = _coconAddressBiz.GetCoconAddressLocalClean(new ReadEntityRequestBo
                {
                    Zipcode = @event.Postcode,
                    HouseNumber = @event.HouseNr,
                    HouseNumberSuffix = @event.HouseExt,
                    Room = @event.Room
                }).Key;

                if (coconData == null) return;
                @event.FiberAData = coconData.FiberA;
                @event.FiberBData = coconData.FiberB;
            }
            catch (Exception ex)
            {
                throw new WritePatchBizException("Can't set routing in WritePatch biz" + ex.Message);
            }
        }
    }
}
