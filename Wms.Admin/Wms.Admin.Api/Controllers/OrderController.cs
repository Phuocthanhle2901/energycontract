using Common;
using IFD.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DeletingOrder;
using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

namespace Wms.Admin.Api.Controllers
{
    [Route("order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly ILogger _logger;
        public OrderController(IOrderService orderService, ILogger logger)
        {
            _orderService = orderService;
            _logger = logger;
        }
        [HttpDelete]
        [Route("deleteByExternalOrderUid")]
        public async Task<IActionResult> DeleteByExternalOrderUid([FromQuery, Required]string externalOrderUid, [FromQuery] string headerId, [FromQuery]string headerSystemId)
        {
            var result = await _orderService.DeleteByExternalOrderUid(externalOrderUid, headerId, headerSystemId);
            if (result == null)
                return NotFound("This order is not exsist");
            if (result.deleteMain == null) 
                return BadRequest("Delete order to Main database unsuccessful");
            else if(result.deleteSla == null)
                return BadRequest("Delete order to Sla database unsuccessful");
            else if(result.deleteCpAdapter == null)
                return BadRequest("Delete order to CpAdapter database unsuccessful");
            else if (result.deleteRedis == null)
                return BadRequest("Delete order to Redis unsuccessful");
            else
                return Ok(result);
        }
        [HttpDelete]
        [Route("deleteByWmsId")]
        public async Task<IActionResult> DeleteByWmsId([FromQuery, Required]string wmsId)
        {
            long.TryParse(wmsId, out var wmsIdParsing);
            var result = await _orderService.DeleteByWmsId(wmsIdParsing);
            if (result.deleteMain == null)
                return BadRequest("Delete order to Main database unsuccessful");
            else if (result.deleteSla == null)
                return BadRequest("Delete order to Sla database unsuccessful");
            else if (result.deleteCpAdapter == null)
                return BadRequest("Delete order to CpAdapter database unsuccessful");
            else if (result.deleteRedis == null)
                return BadRequest("Delete order to Redis unsuccessful");
            else
                return Ok(result);
        }
        [HttpGet]
        [Route("search")]
        public IActionResult SearchByExternalUidAndOrderUid([FromQuery]string orderId, [FromQuery]string externalOrderUId)
        {
            try
            {
                var result = _orderService.GetOrders(externalOrderUId, orderId);
                _logger.LogException(LoggingEnum.UDR0028);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }
    }
}