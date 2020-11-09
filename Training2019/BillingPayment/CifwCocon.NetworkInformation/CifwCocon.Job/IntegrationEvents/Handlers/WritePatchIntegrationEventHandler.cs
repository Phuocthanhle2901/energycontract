using AutoMapper;
using Cifw.Core.Exceptions;
using Cifw.EventBus.Abstractions;
using CifwCocon.NetworkInformation.Biz;
using CifwCocon.NetworkInformation.Biz.Notification;
using CifwCocon.NetworkInformation.Bo;
using CifwCocon.NetworkInformation.Bo.IntegrationEvents.Events;
using IFD.Logging;
using IFD.Mailling;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using WritePatchJob.CircuitBreaker;
using static Cifw.EventBus.Enums.RabbitMQEnum;
using EventBusException = Cifw.EventBus.Exceptions;

namespace WritePatchJob.IntegrationEvents.Handlers
{
    public class WritePatchIntegrationEventHandler
        : IIntegrationEventHandler<WritePatchIntegrationEvent>
    {
        private IConfiguration _config;
        private ILogger _logger;
        private WritingPatchAdapterMachine _adapterMachine;
        private OrderCoconBiz _orderCoconBiz;
        private CoconConfigurationBiz _coconConfig;
        private IMapper _mapper;
        private IEventBus _eventBus;
        private readonly INotificationService _notificationService;
        private IMemoryCache _cache;
        private readonly IEmailService _emailService;
        public WritePatchIntegrationEventHandler(ILogger logger, IConfiguration config, WritingPatchAdapterMachine adapterMachine, OrderCoconBiz orderCoconBiz, CoconConfigurationBiz coconConfig, IMapper mapper, IEventBus eventBus, INotificationService notificationService, IMemoryCache memoryCache, IEmailService emailService)
        {
            _config = config;
            _logger = logger;
            _adapterMachine = adapterMachine;
            _orderCoconBiz = orderCoconBiz;
            _coconConfig = coconConfig;
            _mapper = mapper;
            _eventBus = eventBus;
            _notificationService = notificationService;
            _cache = memoryCache;
            _emailService = emailService;
        }
        public void Handle(WritePatchIntegrationEvent @event)
        {
            var tags = new Dictionary<string, string>()
            {
                { "SearchCode",  @event.SearchCode ?? $"{@event.Postcode}{@event.HouseNr}{@event.HouseExt}{@event.Room}"},
                { "OrderId",  @event.OrderId.ToString()},
                { "FiberCode", @event.Fiber == 1 ? "FIBER_A" : @event.Fiber == 2 ? "FIBER_B" : null},
                { "ActiveOperator", @event.ActiveOperator },
            };

            _logger.SetCorrelationId(@event.CorrelationId);
            _logger.SetMessageId(@event.Id.ToString());
            _logger.SetAdditionalCorrelations(tags);

            var item = _mapper.Map<WritePatchIntegrationEvent, ChangePortQueueRequest>(@event);

            try
            {
                var coconValueConFig = _coconConfig.GetCoconConfiguration();
                _adapterMachine.SetCorrelationId(@event.CorrelationId);
                _adapterMachine.SetAdditionalCorrelations(tags);
                _adapterMachine.ExcuteAction(() =>
                {
                    _adapterMachine.SetCorrelationId(@event.CorrelationId);
                    _adapterMachine.SetAdditionalCorrelations(tags);
                    _logger.LogException(NimFiberLoggingEnum.NFI0028);

                    bool.TryParse(_config["EnableWritePatch"], out bool enableWritePatch);
                    var lenghDevicePort = 100;
                    int.TryParse(_config["lenghDeviceport"], out lenghDevicePort);
                    //CIFW-7073 work paralle system
                    if (enableWritePatch == true)
                    {
                        _orderCoconBiz.WritePatchDataToCoCon(
                                item.Postcode,
                                item.HouseNr.ToString(),
                                item.Fiber.ToString(),
                                //CIFW-7784 - Maximum length of string Deviceport
                                SubStringDevicePort(item.DevicePort, lenghDevicePort),
                                item.HouseExt,
                                item.Room,
                                item.ExternalId,
                                item.OrderDate,
                                item.OrderType,
                                item.ActiveOperator
                        );

                        _logger.LogException(NimFiberLoggingEnum.NFI0029);

                        //Auto mapper: Ignored FiberA,B data
                        var itemUpdateLocalCache = _mapper.Map<WritePatchIntegrationEvent, UpdateLocalCacheByPatchIntegrationEvent>(@event,
                            opts: op => op.ConfigureMap().ForMember(src => src.FiberAData, i => i.Ignore())
                                                         .ForMember(src => src.FiberBData, i => i.Ignore()));
                        itemUpdateLocalCache.CorrelationId = @event.CorrelationId;

                        //Get original data in database 
                        //- Set FiberA & Fiber B
                        _orderCoconBiz.AddFiberAddressInfo(itemUpdateLocalCache);


                        _eventBus.Publish(itemUpdateLocalCache, _config["QueueNameUpdateLocalCache"]);
                    }
                }, coconValueConFig.CbRetry, coconValueConFig.CbTimeout);
            }
            catch (BusinessException ex)
            {

                // Send mail in case of return specific Cocon message
                _notificationService.RequestNotification(item.OrderId, "WMS.NFI0031", $"Patch registration failed for {item.OrderId}", ex.Message);

                throw new EventBusException.EventBusRabbitMQException(RabbitFailureAction.NoRetry, "Handle WritePatchIntegrationEvent unsuccessfully (Bussiness error - without retry)");
            }
            catch (AdapterMachineException ex)
            {
                _logger.LogException(NimFiberLoggingEnum.NFI0031, ex);
                // send mail when case that writing PP/PD failed
                var _keyCache = $"{item.OrderId}-{item.ActionTypeId}-{item.Postcode}-{item.HouseNr}";
                if (IsExpiredIntervalEmailSending(_keyCache))
                {
                    _logger.Debug($"Request Cocon/SpeerIT with ExternalId {item.ExternalId} failed, WMS request notification.");
                    _emailService.SendMailAsync(_config["writePathTemplate"], $"WritePatch failed for ExternalId {item.ExternalId}", item.ExternalId.ToString(), ex.Message);
                }
                else
                {
                    _logger.Debug($"Request Cocon/SpeerIT with ExternalId: {item.ExternalId} and Key : {_keyCache} failed but WMS don’t request notification because the last-tried value still in the intervalTimeSendEmail");

                }
                throw new EventBusException.EventBusRabbitMQException(RabbitFailureAction.Retry, "Handle WritePatchIntegrationEvent unsuccessfully (Connection error - will retry later)");
            }
            finally
            {
                _logger.ResetAdditionalCorrelations();
            }
        }

        /// <summary>
        /// SubstringDevicePort ticket CIFW-7784
        /// </summary>
        /// <param name="devicePort"></param>
        /// <returns></returns>
        private string SubStringDevicePort(string devicePort, int lenghDevicePort)
        {

            if (!string.IsNullOrEmpty(devicePort))
            {
                if (devicePort.Length > lenghDevicePort)
                {
                    devicePort = devicePort.Substring(0, lenghDevicePort);
                }
            }
            return devicePort;
        }


        /// <summary>
        /// IsExpired Interval Email Sending
        /// </summary>
        /// <param name="keyCache"></param>
        /// <returns>
        ///     true: Expired
        ///     false: NotExpired
        ///</returns>
        private bool IsExpiredIntervalEmailSending(string keyCache)
        {
            DateTime lastTried;

            var timeLastTriedBool = _cache.TryGetValue(keyCache, out lastTried);
            // Look for cache key.
            if (!timeLastTriedBool)
            {
                // Key not in cache, so get data.
                lastTried = DateTime.Now;
                // Save data in cache.
                _cache.Set(keyCache, lastTried);
                return true;
            }
            else
            {
                var getTime = DateTime.Now - lastTried;
                if (getTime.TotalSeconds > Convert.ToInt32(_config["intervalTimeSendEmail"]))
                {
                    _cache.Remove(keyCache);
                    _cache.Set(keyCache, DateTime.Now);
                    return true;
                }
            }
            return false;
        }
    }
}