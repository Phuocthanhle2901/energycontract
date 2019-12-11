using Common;
using DomainModel.TerminatedOrder;
using IFD.Logging;
using Microsoft.AspNetCore.Mvc;
using Service;
using System;
using System.Threading.Tasks;

namespace Wms.Admin.Api.Controllers
{
    [Route("terminated/orders")]
    public class TerminatedOrderController : Controller
    {
        private ITerminatedOrderService _service;
        private ILogger _logger;

        public TerminatedOrderController(ITerminatedOrderService service, ILogger logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Index([FromQuery] TerminatedOrderSearchDto search)
        {
            try
            {
                var data = _service.Get(search);
                return StatusCode(200, data);
            }
            catch(Exception ex)
            {
                _logger.Warn("Get ternimated orders failed", ex);
                return StatusCode(500, ex);
            }
        }

        [HttpPut]
        [Route("{wmsId}")]
        public IActionResult Put(long wmsId)
        {
            var updateOrderAndDeleteRedis= _service.UpdateTerminatedOrder(wmsId);
            if(updateOrderAndDeleteRedis.isSuccess==false)
            {
                _logger.LogException(LoggingEnum.UDR0037, message: $"Update ternimated orders with wms_id {wmsId}  failed with reason: {updateOrderAndDeleteRedis.result} ");
                return StatusCode(500, $"Update ternimated orders with wms_id {wmsId}  failed with reason : { updateOrderAndDeleteRedis.result} ");
            }
            return StatusCode(200);
        }
    }
}