using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Common.Models;
using IFD.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using styx2_crs_send.Core;
using styx2_crs_send.Handle;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace styx2_crs_send.Controllers
{
    [Route("tasks")]
    [ApiController]
    public class RestGatewayController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly ICRSClient _cRSClient;
        public RestGatewayController(ILogger logger, ICRSClient cRSClient)
        {
            _logger = logger;
            _cRSClient = cRSClient;
        }

        [HttpPut]
        public IActionResult UpdateTaskByTicketRef([FromRoute]string wmsTaskId = null, [FromBody] TaskModel updateTask = null)
        {
            ResultFn result = null;
            if (updateTask != null)
            {
                result = _cRSClient.UpdateTicket(updateTask);
            }
            else
            {
                _logger.LogException(LoggingEnum.SCS0005);
            }
            return StatusCode(StatusCodes.Status200OK, new { ticketRef = updateTask.TicketRef, result });
        }
    }
}
