using System.ComponentModel.DataAnnotations;
using Common;
using DomainModel;
using IFD.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service;

namespace Wms.Admin.Api.Controllers
{
    [Route("api")]
    [ApiController]
    public class UnroutedOrderController : Controller
    {
        private readonly IUnroutedOrderService _unroutedOrderService;
        private readonly ILogger _logger;

        public UnroutedOrderController(IUnroutedOrderService unroutedOrderService, ILogger logger)
        {
            _unroutedOrderService = unroutedOrderService;
            _logger = logger;
        }

        // GET unrouted orders
        [HttpGet]
        [Route("unroutedorder")]
        public IActionResult GetUnRoutedOrder(int page,int pageSize)
        {
             var result = _unroutedOrderService.GetAll(page, pageSize);
             _logger.LogException(LoggingEnum.UDR0001);
             return Ok(result); 
        }

        // GET destinations
        [HttpGet]
        [Route("destination")]
        public IActionResult GetDestination()
        {
             var result = _unroutedOrderService.GetDestinations();
             _logger.LogException(LoggingEnum.UDR0004);
              return Ok(result);
        }

        // PUT update
        [HttpPut]
        [Route("unroutedorder")]
        public IActionResult Update([FromQuery, Required]long wmsid, [FromBody]Destination destination)
        {
            _unroutedOrderService.Update(wmsid, destination);
            _logger.LogException(LoggingEnum.UDR0007);
            return StatusCode(StatusCodes.Status200OK);
        }

    }
}
