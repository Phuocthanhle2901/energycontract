using AutoMapper;
using Cifw.Core;
using Cifw.Core.Constants;
using Cifw.Core.Exceptions;
using Cifw.EventBus.Abstractions;
using Cifw.Core.Patterns.Retry;
using CifwCocon.NetworkInformation.Biz.CircuitBreaker;
using CifwCocon.NetworkInformation.Bo;
using CifwCocon.NetworkInformation.Bo.Integration.Events;
using CoconService;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Security;
using static Cifw.Core.Constants.CoconConstants;
using IFD.Logging;
using System;

namespace CifwCocon.NetworkInformation.Biz
{
    public class CoconNetworkBiz
    {
        private ILogger _logger;
        private IMapper _mapper;
        private GettingCabinetAdapterMachine _adapterMachine;
        private RetryMachine _retryMachine;
        private CoconConfigurationBiz _coconConfig;
        private CoconAddressBiz _coconAddressBiz;
        private IEventBus _eventBus;
        private IConfiguration _config;

        public CoconNetworkBiz(ILogger logger, IConfiguration config, IMapper mapper, GettingCabinetAdapterMachine adapterMachine, RetryMachine retryMachine,
            CoconConfigurationBiz coconConfig, CoconAddressBiz coconAddressBiz, IEventBus eventBus)
        {
            _logger = logger;
            _mapper = mapper;
            _adapterMachine = adapterMachine;
            _retryMachine = retryMachine;
            _coconConfig = coconConfig;
            _coconAddressBiz = coconAddressBiz;
            _eventBus = eventBus;
            _config = config;
        }

        /// <summary>
        /// Key: Result
        /// Value: WarningMessage
        /// Return null that means switch to local cache
        /// </summary>
        /// <param name="request"></param>
        /// <param name="IsClean"></param>
        /// <returns></returns>
        public KeyValuePair<ReadEntityResponse, string> ReadEntity(ReadEntityRequestBo request, bool IsClean = false)
        {
            var fieldConditions = new List<FieldCondition>();
            var coconConfiguration = _coconConfig.GetCoconConfiguration();
            var retryConfiguration = _coconConfig.GetRetryConfiguration();

            //CIFW-5474 
            //Case retry
            var enableQueueReUpdateTechnicalPath = _config["EnableQueueReUpdateTechnicalPath"];
            if (string.IsNullOrEmpty(enableQueueReUpdateTechnicalPath))
                throw new ArgumentNullException("Missing Configuration:enableQueueReUpdateTechnicalPath");

            if (bool.Parse(enableQueueReUpdateTechnicalPath))
                _adapterMachine.RaiseEventToReupdateTechpath(() => RaiseEventReupdateTechnicalPath());

            fieldConditions.Add(new FieldCondition
            {
                Field = "ADDRESSES",
                Value = new FieldCondition[]
                {
                    new FieldCondition
                    {
                        Value = new FieldCondition[]
                        {
                            new FieldCondition
                            {
                                Operation = "=",
                                Value = request.Zipcode,
                                Field = "ADDRESS.ZIPCODE",
                            },
                            new FieldCondition
                            {
                                Operation = "=",
                                Value = request.HouseNumber,
                                Field = "ADDRESS.HOUSENR",
                            },
                             new FieldCondition
                            {
                                Operation = "=",
                                Value = request.HouseNumberSuffix,
                                Field = "ADDRESS.HOUSENR_SUFFIX",
                            },
                            new FieldCondition
                            {
                                Operation = "=",
                                Value = request.Room,
                                Field = "ADDRESS.ROOM",
                            }
                        }
                    }
                }
            });

            var strFields = IsClean ? new ArrayOfString()
            {
                //Address
                "ADDRESS.ZIPCODE",
                "ADDRESS.HOUSENR",
                "ADDRESS.HOUSENR_SUFFIX",
                "ADDRESS.ROOM",
                "ADDRESS.HASDATE",
                "ADDRESS.FTUTYPE",
                "ADDRESS.FRAME",
                "ADDRESS.DELIVERYSTATUS",
                "ADDRESS.FIXEDCHARGE_STATUS",
                "ADDRESS.COMMENTS",

                "NET_AREA.MONTHLYCODE",
                "NET_AREA.ONCEONLYCODE",
                "NET_AREA.REDEMPTIONCODE",

                //Fiber
                "FTTHFIBER.POP_ROW",
                "FTTHFIBER.POP_POSITION",
                "FTTHFIBER.ACTIVE_PORT",
                "FTTHFIBER.POP_LOCATION",
                "FTTHFIBER.POP_SHELF",
                "FTTHFIBER.POP_FRAME",
                "FTTHFIBER.ACTIVE_OPERATOR",
                "FTTHFIBER.ACTIVE_ORDERTYPE_PLANNED",
                "FTTHFIBER.ACTIVE_OPERATOR_PLANNED",
                "FTTHFIBER.ACTIVE_OPERATOR_ORDERID_PLANNED",
                "FTTHFIBER.ACTIVE_OPERATOR_ORDERID",

                "FTTHFIBER2.POP_ROW",
                "FTTHFIBER2.POP_POSITION",
                "FTTHFIBER2.ACTIVE_PORT",
                "FTTHFIBER2.POP_LOCATION",
                "FTTHFIBER2.POP_SHELF",
                "FTTHFIBER2.POP_FRAME",
                "FTTHFIBER2.ACTIVE_OPERATOR",
                "FTTHFIBER2.ACTIVE_ORDERTYPE_PLANNED",
                "FTTHFIBER2.ACTIVE_OPERATOR_PLANNED",
                "FTTHFIBER2.ACTIVE_OPERATOR_ORDERID_PLANNED",
                "FTTHFIBER2.ACTIVE_OPERATOR_ORDERID",

                //Routing
                "AGGR.ADMINISTRATORS",
                "AGGR.ACTIVE_OPERATORS",
                "AGGR.AREA_ADMINISTRATORS",
                "AGGR.AREA_ACTIVE_OPERATORS",

                "AGGR2.ADMINISTRATORS",
                "AGGR2.ACTIVE_OPERATORS",
                "AGGR2.AREA_ADMINISTRATORS",
                "AGGR2.AREA_ACTIVE_OPERATORS"
            } :

            new ArrayOfString()
            {
                  //Address
                "ADDRESS.ZIPCODE",
                "ADDRESS.HOUSENR",
                "ADDRESS.HOUSENR_SUFFIX",
                "ADDRESS.ROOM",
                "ADDRESS.HASDATE",
                "ADDRESS.FTUTYPE",
                "ADDRESS.FRAME",
                "ADDRESS.DELIVERYSTATUS",
                "ADDRESS.FIXEDCHARGE_STATUS",
                "ADDRESS.COMMENTS",

                "NET_AREA.MONTHLYCODE",
                "NET_AREA.ONCEONLYCODE",
                "NET_AREA.REDEMPTIONCODE",

                //Fiber
                "FTTHFIBER.POP_ROW",
                "FTTHFIBER.POP_POSITION",
                "FTTHFIBER.ACTIVE_PORT",
                "FTTHFIBER.POP_LOCATION",
                "FTTHFIBER.POP_SHELF",
                "FTTHFIBER.POP_FRAME",
                "FTTHFIBER.ACTIVE_OPERATOR",
                "FTTHFIBER.ACTIVE_ORDERTYPE_PLANNED",
                "FTTHFIBER.ACTIVE_OPERATOR_PLANNED",
                "FTTHFIBER.ACTIVE_OPERATOR_ORDERID_PLANNED",
                "FTTHFIBER.ACTIVE_OPERATOR_ORDERID",

                "FTTHFIBER2.POP_ROW",
                "FTTHFIBER2.POP_POSITION",
                "FTTHFIBER2.ACTIVE_PORT",
                "FTTHFIBER2.POP_LOCATION",
                "FTTHFIBER2.POP_SHELF",
                "FTTHFIBER2.POP_FRAME",
                "FTTHFIBER2.ACTIVE_OPERATOR",
                "FTTHFIBER2.ACTIVE_ORDERTYPE_PLANNED",
                "FTTHFIBER2.ACTIVE_OPERATOR_PLANNED",
                "FTTHFIBER2.ACTIVE_OPERATOR_ORDERID_PLANNED",
                "FTTHFIBER2.ACTIVE_OPERATOR_ORDERID"
            };

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

            _logger.LogException(NimFiberLoggingEnum.NFI0025);

            ReadEntityResponse response = null;
            string originalRequestId = _logger.GetCorrelationId();
            string messageId = _logger.GetMessageId();
            var additionalProperties = _logger.GetAdditionalCorrelations();
            try
            {
                var oldState = _adapterMachine.State;
                var newState = _adapterMachine.State;

                _adapterMachine.SetCorrelationId(originalRequestId);
                _adapterMachine.SetMessageId(messageId);
                _adapterMachine.SetAdditionalCorrelations(additionalProperties);

                _logger.SetCorrelationId(originalRequestId);
                _logger.SetMessageId(messageId);
                _logger.SetAdditionalCorrelations(additionalProperties);

                _adapterMachine.ExcuteAction(() =>
                {
                    _retryMachine.CorrelationId = originalRequestId;
                    _retryMachine.MessageId = originalRequestId;
                    _retryMachine.AdditionalCorrelations = additionalProperties;

                    _logger.SetCorrelationId(originalRequestId);
                    _logger.SetMessageId(messageId);
                    _logger.SetAdditionalCorrelations(additionalProperties);

                    _retryMachine.RetryAsync(() =>
                    {
                        _logger.SetCorrelationId(originalRequestId);
                        _logger.SetMessageId(messageId);
                        _logger.SetAdditionalCorrelations(additionalProperties);

                        using (new OperationContextScope(soapClient.InnerChannel))
                        {
                            HttpRequestMessageProperty requestMessage = new HttpRequestMessageProperty();
                            requestMessage.Headers["X-Request-ID"] = originalRequestId;
                            OperationContext.Current.OutgoingMessageProperties[HttpRequestMessageProperty.Name] = requestMessage;
                            response = soapClient.ReadEntityAsync(coconConfiguration.CentralCoconFolder,
                                                                                coconConfiguration.Environment,
                                                                                coconConfiguration.UserName,
                                                                                coconConfiguration.Password,
                                                                                coconConfiguration.Culture,
                                                                                coconConfiguration.Contract,
                                                                                fieldConditions.ToArray(), strFields, null).Result;
                        }
                    }, retryConfiguration.RetryCount, retryConfiguration.RetryDelay, retryConfiguration.ReTryTimeout).Wait();

                    _logger.SetCorrelationId(originalRequestId);
                    _logger.SetMessageId(messageId);
                    _logger.SetAdditionalCorrelations(additionalProperties);

                    _logger.LogException(NimFiberLoggingEnum.NFI0006);
                }, coconConfiguration.CbRetry, coconConfiguration.CbTimeout);

                if (bool.Parse(enableQueueReUpdateTechnicalPath) && newState == Cifw.Core.Patterns.CircuitBreaker.StateMachine.CircuitBreakerState.Close && oldState != Cifw.Core.Patterns.CircuitBreaker.StateMachine.CircuitBreakerState.Close)
                    RaiseEventReupdateTechnicalPath();
            }
            catch (AdapterMachineException ex)
            {
                if (!string.IsNullOrEmpty(ex.LastExceptionCorrelationId))
                {
                    _logger.LogException(NimFiberLoggingEnum.NFI0007, ex, message: $"Get network information In Biz failed because of CB-blocking from (x-request-id) lastExceptionCorrelationId: {ex.LastExceptionCorrelationId}");
                }
                else
                {
                    _logger.LogException(NimFiberLoggingEnum.NFI0007, ex);
                }
                _logger.LogException(NimFiberLoggingEnum.NFI0007, ex, message: $"lastExceptionCorrelationId: {ex.LastExceptionCorrelationId}");
                return new KeyValuePair<ReadEntityResponse, string>(response, $"Get fiber network from Cocon(SpeerIT) is failed. Please contact with WMS administrator to check nim module");
            }

            _logger.LogException(NimFiberLoggingEnum.NFI0026);
            return new KeyValuePair<ReadEntityResponse, string>(response, null);
        }

        /// <summary>
        /// Return null that means switch to local cache
        /// </summary>
        /// <param name="request"></param>
        /// <param name="IsClean"></param>
        /// <returns></returns>
        public ReadEntityResponse ReadEntityResponse(ReadEntityRequestBo request, bool IsClean = false)
        {
            var fieldConditions = new List<FieldCondition>();
            var coconConfiguration = _coconConfig.GetCoconConfiguration();
            var retryConfiguration = _coconConfig.GetRetryConfiguration();
            fieldConditions.Add(new FieldCondition
            {
                Field = "ADDRESSES",
                Value = new FieldCondition[]
                {
                    new FieldCondition
                    {
                        Value = new FieldCondition[]
                        {
                            new FieldCondition
                            {
                                Operation = "=",
                                Value = request.Zipcode,
                                Field = "ADDRESS.ZIPCODE",
                            },
                            new FieldCondition
                            {
                                Operation = "=",
                                Value = request.HouseNumber,
                                Field = "ADDRESS.HOUSENR",
                            },
                             new FieldCondition
                            {
                                Operation = "=",
                                Value = request.HouseNumberSuffix,
                                Field = "ADDRESS.HOUSENR_SUFFIX",
                            },
                            new FieldCondition
                            {
                                Operation = "=",
                                Value = request.Room,
                                Field = "ADDRESS.ROOM",
                            }
                        }
                    }
                }
            });

            var strFields = IsClean ? new ArrayOfString()
            {
                //Address
                "ADDRESS.ZIPCODE",
                "ADDRESS.HOUSENR",
                "ADDRESS.HOUSENR_SUFFIX",
                "ADDRESS.ROOM",
                "ADDRESS.HASDATE",
                "ADDRESS.FTUTYPE",
                "ADDRESS.FRAME",
                "ADDRESS.DELIVERYSTATUS",
                "ADDRESS.FIXEDCHARGE_STATUS",
                "ADDRESS.COMMENTS",

                "NET_AREA.MONTHLYCODE",
                "NET_AREA.ONCEONLYCODE",
                "NET_AREA.REDEMPTIONCODE",

                //Fiber
                "FTTHFIBER.POP_ROW",
                "FTTHFIBER.POP_POSITION",
                "FTTHFIBER.ACTIVE_PORT",
                "FTTHFIBER.POP_LOCATION",
                "FTTHFIBER.POP_SHELF",
                "FTTHFIBER.POP_FRAME",
                "FTTHFIBER.ACTIVE_OPERATOR",
                "FTTHFIBER.ACTIVE_ORDERTYPE_PLANNED",
                "FTTHFIBER.ACTIVE_OPERATOR_PLANNED",
                "FTTHFIBER.ACTIVE_OPERATOR_ORDERID_PLANNED",
                "FTTHFIBER.ACTIVE_OPERATOR_ORDERID",

                "FTTHFIBER2.POP_ROW",
                "FTTHFIBER2.POP_POSITION",
                "FTTHFIBER2.ACTIVE_PORT",
                "FTTHFIBER2.POP_LOCATION",
                "FTTHFIBER2.POP_SHELF",
                "FTTHFIBER2.POP_FRAME",
                "FTTHFIBER2.ACTIVE_OPERATOR",
                "FTTHFIBER2.ACTIVE_ORDERTYPE_PLANNED",
                "FTTHFIBER2.ACTIVE_OPERATOR_PLANNED",
                "FTTHFIBER2.ACTIVE_OPERATOR_ORDERID_PLANNED",
                "FTTHFIBER2.ACTIVE_OPERATOR_ORDERID",

                //Routing
                "AGGR.ADMINISTRATORS",
                "AGGR.ACTIVE_OPERATORS",
                "AGGR.AREA_ADMINISTRATORS",
                "AGGR.AREA_ACTIVE_OPERATORS",

                "AGGR2.ADMINISTRATORS",
                "AGGR2.ACTIVE_OPERATORS",
                "AGGR2.AREA_ADMINISTRATORS",
                "AGGR2.AREA_ACTIVE_OPERATORS"
            } :

            new ArrayOfString()
            {
                  //Address
                "ADDRESS.ZIPCODE",
                "ADDRESS.HOUSENR",
                "ADDRESS.HOUSENR_SUFFIX",
                "ADDRESS.ROOM",
                "ADDRESS.HASDATE",
                "ADDRESS.FTUTYPE",
                "ADDRESS.FRAME",
                "ADDRESS.DELIVERYSTATUS",
                "ADDRESS.FIXEDCHARGE_STATUS",
                "ADDRESS.COMMENTS",

                "NET_AREA.MONTHLYCODE",
                "NET_AREA.ONCEONLYCODE",
                "NET_AREA.REDEMPTIONCODE",

                //Fiber
                "FTTHFIBER.POP_ROW",
                "FTTHFIBER.POP_POSITION",
                "FTTHFIBER.ACTIVE_PORT",
                "FTTHFIBER.POP_LOCATION",
                "FTTHFIBER.POP_SHELF",
                "FTTHFIBER.POP_FRAME",
                "FTTHFIBER.ACTIVE_OPERATOR",
                "FTTHFIBER.ACTIVE_ORDERTYPE_PLANNED",
                "FTTHFIBER.ACTIVE_OPERATOR_PLANNED",
                "FTTHFIBER.ACTIVE_OPERATOR_ORDERID_PLANNED",
                "FTTHFIBER.ACTIVE_OPERATOR_ORDERID",

                "FTTHFIBER2.POP_ROW",
                "FTTHFIBER2.POP_POSITION",
                "FTTHFIBER2.ACTIVE_PORT",
                "FTTHFIBER2.POP_LOCATION",
                "FTTHFIBER2.POP_SHELF",
                "FTTHFIBER2.POP_FRAME",
                "FTTHFIBER2.ACTIVE_OPERATOR",
                "FTTHFIBER2.ACTIVE_ORDERTYPE_PLANNED",
                "FTTHFIBER2.ACTIVE_OPERATOR_PLANNED",
                "FTTHFIBER2.ACTIVE_OPERATOR_ORDERID_PLANNED",
                "FTTHFIBER2.ACTIVE_OPERATOR_ORDERID",
            };

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

            _logger.LogException(NimFiberLoggingEnum.NFI0025);

            ReadEntityResponse response = null;
            string originalRequestId = _logger.GetCorrelationId();
            string originalMessageId = _logger.GetMessageId();
            var additionalProperties = _logger.GetAdditionalCorrelations();
            try
            {
                _adapterMachine.SetCorrelationId(originalRequestId);
                _adapterMachine.SetMessageId(originalMessageId);
                _adapterMachine.SetAdditionalCorrelations(additionalProperties);
                _adapterMachine.ExcuteAction(() =>
                {
                    _retryMachine.CorrelationId = originalRequestId;
                    _retryMachine.MessageId = originalMessageId;
                    _retryMachine.AdditionalCorrelations = additionalProperties;
                    _retryMachine.RetryAsync(() =>
                    {
                        _logger.SetCorrelationId(originalRequestId);
                        _logger.SetMessageId(originalMessageId);
                        using (new OperationContextScope(soapClient.InnerChannel))
                        {
                            HttpRequestMessageProperty requestMessage = new HttpRequestMessageProperty();
                            requestMessage.Headers["X-Request-ID"] = originalRequestId;
                            requestMessage.Headers["X-Message-ID"] = originalMessageId;
                            OperationContext.Current.OutgoingMessageProperties[HttpRequestMessageProperty.Name] = requestMessage;
                            response = soapClient.ReadEntityAsync(coconConfiguration.CentralCoconFolder,
                                                                                coconConfiguration.Environment,
                                                                                coconConfiguration.UserName,
                                                                                coconConfiguration.Password,
                                                                                coconConfiguration.Culture,
                                                                                coconConfiguration.Contract,
                                                                                fieldConditions.ToArray(), strFields, null).Result;
                        }
                    }, retryConfiguration.RetryCount, retryConfiguration.RetryDelay, retryConfiguration.ReTryTimeout).Wait();

                    _logger.LogException(NimFiberLoggingEnum.NFI0006);
                }, coconConfiguration.CbRetry, coconConfiguration.CbTimeout);
            }
            catch (AdapterMachineException ex)
            {
                if (!string.IsNullOrEmpty(ex.LastExceptionCorrelationId))
                {
                    _logger.LogException(NimFiberLoggingEnum.NFI0007, ex, message: $"Get network information In Biz failed because of CB-blocking from (x-request-id) lastExceptionCorrelationId: {ex.LastExceptionCorrelationId}");
                }
                else
                {
                    _logger.LogException(NimFiberLoggingEnum.NFI0007, ex);
                }
            }

            _logger.LogException(NimFiberLoggingEnum.NFI0026);
            return response;
        }

        /// <summary>
        /// - Result
        /// - Warning message
        /// Get & clean:
        /// -Real cocon
        /// -Local cache
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public KeyValuePair<CleanCoconResponse, string> CleanNetworkInformation(ReadEntityRequestBo request)
        {
            _logger.LogException(NimFiberLoggingEnum.NFI0018);
            var coconResult = ReadEntity(request, true);
            var responseCocon = coconResult.Key;
            var warningMessage = coconResult.Value;

            CleanCoconResponse responseClean = null;
            var cleanResult = CoconConstants.CleanOrderReason.None;

            //-- Get from local cache
            if (responseCocon?.Body?.ReadEntityResult?.Records == null || responseCocon.Body?.ReadEntityResult?.Records != null && !(bool)responseCocon.Body?.ReadEntityResult?.Records.Any())
            {
                _logger.LogException(NimFiberLoggingEnum.NFI0019);

                //LocalCacheResult
                //-Key: result
                //-Value: warning message
                var localCacheResult = _coconAddressBiz.GetCoconAddressLocalClean(request);
                responseClean = localCacheResult.Key;

                //Combine warning message of Cocon & Local cache
                warningMessage = !string.IsNullOrWhiteSpace(coconResult.Value) ? string.Concat($"{warningMessage}. {localCacheResult.Value}") : localCacheResult.Value;

                if (responseClean != null)
                    responseClean.FromNetwork = FromNetwork.LocalCache;
            }

            //-- Get from real cocon
            else if (responseCocon.Body != null && responseCocon.Body.ReadEntityResult != null && responseCocon.Body.ReadEntityResult.Records != null && responseCocon.Body.ReadEntityResult.Records[0] != null)
            {
                _logger.LogException(NimFiberLoggingEnum.NFI0020);
                var properties = responseCocon.Body.ReadEntityResult.Records[0].Values.ToList();
                if (request.FiberCode.HasValue)
                {
                    responseClean = new CleanCoconResponse
                    {
                        Address = _mapper.Map<List<FieldValue>, Address>(properties),
                        FiberA = request.FiberCode == Cifw.Core.Enums.CoconEnum.FiberEnum.FIBER_A ? _mapper.Map(properties, new FiberClean { FiberType = (int)request.FiberCode }) : null,
                        FiberB = request.FiberCode == Cifw.Core.Enums.CoconEnum.FiberEnum.FIBER_B ? _mapper.Map(properties, new FiberClean { FiberType = (int)request.FiberCode }) : null,
                    };
                }
                else
                {
                    responseClean = new CleanCoconResponse
                    {
                        Address = _mapper.Map<List<FieldValue>, Address>(properties),
                        FiberA = _mapper.Map(properties, new FiberClean { FiberType = (int)Cifw.Core.Enums.CoconEnum.FiberEnum.FIBER_A }),
                        FiberB = _mapper.Map(properties, new FiberClean { FiberType = (int)Cifw.Core.Enums.CoconEnum.FiberEnum.FIBER_B })
                    };
                }

                //Send to localcache
                var updateLocalCacheByCleanIntegrationEvent = new UpdateLocalCacheByCleanIntegrationEvent
                {
                    Address = responseClean.Address,
                    FiberA = _mapper.Map(properties, new FiberClean { FiberType = (int)Cifw.Core.Enums.CoconEnum.FiberEnum.FIBER_A }),
                    FiberB = _mapper.Map(properties, new FiberClean { FiberType = (int)Cifw.Core.Enums.CoconEnum.FiberEnum.FIBER_B })
                };

                updateLocalCacheByCleanIntegrationEvent.CorrelationId = _logger.GetCorrelationId();
                _eventBus.Publish(updateLocalCacheByCleanIntegrationEvent, _config["QueueNameUpdateLocalCache"]);
                responseClean.FromNetwork = FromNetwork.Cocon;
                _logger.LogException(NimFiberLoggingEnum.NFI0021);
            }

            //--Case 204: No content
            if (responseClean == null)
                return new KeyValuePair<CleanCoconResponse, string>(null, warningMessage);

            //--Clean cocon
            if (responseClean.FiberA != null)
            {
                _logger.LogException(NimFiberLoggingEnum.NFI0022);
                responseClean.FiberA.MessageClean = Utils.GetEnumDescription(cleanResult);
            }

            if (responseClean.FiberB != null)
            {
                _logger.LogException(NimFiberLoggingEnum.NFI0023);
                responseClean.FiberB.MessageClean = Utils.GetEnumDescription(cleanResult);
            }

            _logger.LogException(NimFiberLoggingEnum.NFI0024);
            return new KeyValuePair<CleanCoconResponse, string>(responseClean, warningMessage);
        }


        /// <summary>
        /// Get network info only real cocon.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public CleanCoconResponse CleanNetworkInformationV2(ReadEntityRequestBo request)
        {
            _logger.LogException(NimFiberLoggingEnum.NFI0018);
            var responseCocon = ReadEntityResponse(request, true);
            CleanCoconResponse responseClean = null;
            var cleanResult = CoconConstants.CleanOrderReason.None;
            if (responseCocon == null)
            {
                return null;
            }
            else if (responseCocon?.Body?.ReadEntityResult?.Records == null || responseCocon.Body?.ReadEntityResult?.Records != null && !(bool)responseCocon.Body?.ReadEntityResult?.Records.Any())
            {
                responseClean = null;
            }
            else if (responseCocon.Body != null && responseCocon.Body.ReadEntityResult != null && responseCocon.Body.ReadEntityResult.Records != null && responseCocon.Body.ReadEntityResult.Records[0] != null)
            {
                _logger.LogException(NimFiberLoggingEnum.NFI0020);
                var properties = responseCocon.Body.ReadEntityResult.Records[0].Values.ToList();
                if (request.FiberCode.HasValue)
                {
                    responseClean = new CleanCoconResponse
                    {
                        Address = _mapper.Map<List<FieldValue>, Address>(properties),
                        FiberA = request.FiberCode == Cifw.Core.Enums.CoconEnum.FiberEnum.FIBER_A ? _mapper.Map(properties, new FiberClean { FiberType = (int)request.FiberCode }) : null,
                        FiberB = request.FiberCode == Cifw.Core.Enums.CoconEnum.FiberEnum.FIBER_B ? _mapper.Map(properties, new FiberClean { FiberType = (int)request.FiberCode }) : null,
                    };
                }
                else
                {
                    responseClean = new CleanCoconResponse
                    {
                        Address = _mapper.Map<List<FieldValue>, Address>(properties),
                        FiberA = _mapper.Map(properties, new FiberClean { FiberType = (int)Cifw.Core.Enums.CoconEnum.FiberEnum.FIBER_A }),
                        FiberB = _mapper.Map(properties, new FiberClean { FiberType = (int)Cifw.Core.Enums.CoconEnum.FiberEnum.FIBER_B })
                    };
                }
                responseClean.FromNetwork = FromNetwork.Cocon;
            }

            if (responseClean == null)
                return null;

            //Clean cocon
            if (responseClean.FiberA != null)
            {
                _logger.LogException(NimFiberLoggingEnum.NFI0022);
                responseClean.FiberA.MessageClean = Utils.GetEnumDescription(cleanResult);
            }

            if (responseClean.FiberB != null)
            {
                _logger.LogException(NimFiberLoggingEnum.NFI0023);
                responseClean.FiberB.MessageClean = Utils.GetEnumDescription(cleanResult);
            }

            _logger.LogException(NimFiberLoggingEnum.NFI0024);
            return responseClean;
        }

        private void RaiseEventReupdateTechnicalPath()
        {
            _logger.LogException(NimFiberLoggingEnum.NFI0027);
            var reupdateTechnicalEvent = new ReupdateTechnicalEvent();
            _eventBus.Publish(reupdateTechnicalEvent, "QueueReUpdateTechnicalPath");
        }
    }
}
