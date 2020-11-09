using AutoMapper;
using Cifw.Core.Constants;
using IFD.Logging;
using CifwCocon.NetworkInformation.Bo;
using CifwCocon.Repositories;
using Microsoft.Extensions.Configuration;
using System.Net;
using Cifw.EventBus.Abstractions;
using CifwCocon.NetworkInformation.Bo.IntegrationEvents.Events;

namespace CifwCocon.NetworkInformation.Biz
{
    public class WritePatchBiz
    {
        private ILogger _logger;
        private UnitOfWork _uow;
        private IMapper _mapper;
        private IConfiguration _config;        
        private IEventBus _eventBus;

        public WritePatchBiz(ILogger logger, IConfiguration config, UnitOfWork uow, IMapper mapper,  IEventBus eventBus)       
        {
            _logger = logger;
            _config = config;
            _uow = uow;
            _mapper = mapper;            
            _eventBus = eventBus;
        }
        public Response CreateChangePortQueueFf(ChangePortQueueRequest request)
        {
            _logger.LogException(NimFiberLoggingEnum.NFI0013);
            CreateChangePortQueue(request);

            _logger.LogException(NimFiberLoggingEnum.NFI0014);
            return new Response
            {
                Code = (int)HttpStatusCode.OK,
                Message = CoconConstants.MsgSuccessful
            };
        }       

        private void CreateChangePortQueue(ChangePortQueueRequest request)
        {
            var modelEvent = _mapper.Map<ChangePortQueueRequest, WritePatchIntegrationEvent>(request);
            _logger.LogException(NimFiberLoggingEnum.NFI0015);
            _eventBus.Publish(modelEvent, _config["QueueName"]);
            _logger.LogException(NimFiberLoggingEnum.NFI0016);
        }       
    }
}
