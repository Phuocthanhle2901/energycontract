using System;
using Common;
using DomainModel;
using IFD.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.OrderSla;
using static DomainModel.Enum.OrderSlaEnum;
using System.Globalization;
using IIsAcService;
using DomainModel.DtoSlaRule;

namespace Wms.Admin.Api.Controllers
{
    [Route("api")]
    [ApiController]
    public class OrderSlaController : Controller
    {
        private readonly ISlaService _slaService;
        private readonly ILogger _logger;
        public OrderSlaController(ISlaService slaService, ILogger logger)
        {
            _slaService = slaService;
            _logger = logger;
        }

        // GET List slaOrder
        [HttpGet]
        [Route("SlaRuleOrderAll")]
        public IActionResult GetSlaOrderAll(int page, int pageSize, [FromQuery] RuleSearchDto search, [FromQuery] SortRule sort)
        {
            try
            {
                var result = _slaService.GetAll(page, pageSize, search, sort);
                _logger.LogException(LoggingEnum.UDR0015);
                return Ok(result);
            }
            catch (ClientException ex)
            {
                _logger.LogException(ex.LogObject);
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogException(LoggingEnum.UDR0016, ex);
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        // GET List GetOrganisatie
        [HttpGet]
        [Route("Organisatie")]
        public IActionResult GetOrganisatie()
        {
            var result = _slaService.GetOrganisatie();
            return Ok(result);
        }

        // GET List GetConnectionStatus
        [HttpGet]
        [Route("ConnectionStatus")]
        public IActionResult GetConnectionStatus()
        {
            var result = _slaService.GetConnectionStatus();
            return Ok(result);
        }

        // GET List GetConstructionStatus
        [HttpGet]
        [Route("ConstructionStatus")]
        public IActionResult GetConstructionStatus()
        {
            var result = _slaService.GetConstructionStatus();
            return Ok(result);
        }

        /// <summary>
        /// Gets the measure.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("Measurement")]
        public IActionResult GetMeasure()
        {
            var result = _slaService.GetMeasure();
            return Ok(result);
        }

        /// <summary>
        /// Gets the measure unit.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("MeasureUnit")]
        public IActionResult GetMeasureUnit()
        {
            var result = _slaService.GetMeasureUnit();
            return Ok(result);
        }


        /// <summary>Gets the type of the net work.</summary>
        /// <returns></returns>
        [HttpGet]
        [Route("NetWorkType")]
        public IActionResult GetNetWorkType()
        {
            var result = _slaService.GetNetWorkType();
            return Ok(result);
        }

        // GET List GetNLType
        [HttpGet]
        [Route("NLType")]
        public IActionResult GetNlType()
        {
            var result = _slaService.GetNlType();
            return Ok(result);
        }

        // GET List GetOrderType
        [HttpGet]
        [Route("OrderType")]
        public IActionResult GetOrderType()
        {
            var result = _slaService.GetOrderType();
            return Ok(result);
        }

        // GET List Priority
        [HttpGet]
        [Route("Priority")]
        public IActionResult Priority()
        {
            var result = _slaService.GetPriority();
            return Ok(result);
        }

        // GET List Calendar
        [HttpGet]
        [Route("Calendar")]
        public IActionResult Calendar()
        {
            var result = _slaService.Calendar();
            return Ok(result);
        }

        // GET List GetSLAType
        [HttpGet]
        [Route("SLAType")]
        public IActionResult GetSlaType()
        {
            var result = _slaService.GetSlaType();
            return Ok(result);
        }

        /// Insert slaRule
        [HttpPost]
        [Route("InsertSlaRule")]
        public IActionResult InsertSlaRule(SlaRule slaRule)
        {
            try
            {
                var result = _slaService.InsertSlaRule(slaRule);
                _logger.LogException(LoggingEnum.UDR0011);
                return Ok(result);
            }
            catch (ClientException ex)
            {
                _logger.LogException(ex.LogObject);
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogException(LoggingEnum.UDR0012, ex);
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

        // Update slaRule
        [HttpPut]
        [Route("UpdateSlaRule")]
        public IActionResult UpdateSlaRule(SlaRule slaRule)
        {
            try
            {
                var result = _slaService.UpdateSlaRule(slaRule);
                if (result.Code == "0")
                {
                    _logger.LogException(LoggingEnum.UDR0013);
                    return Ok(result.Text);
                }
                else
                {
                    _logger.LogException(LoggingEnum.UDR0014);
                    return StatusCode(StatusCodes.Status400BadRequest, result.Text);
                }
            }
            catch (ClientException ex)
            {
                _logger.LogException(ex.LogObject);
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogException(LoggingEnum.UDR0014, ex);
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        //BC View
        [HttpPost]
        [Route("CheckEndpoint")]
        public JsonResult BcView()
        {
            var client = new IsacClientClient();
            try
            {
                var response = client.BcViewAsync();
                if (response != null)
                {
                    return Json(new { Result = "OK" });
                }
                return Json(new { Result = "ERROR", Message = ValidationMessage.SystemError });
            }
            catch (Exception)
            {
                return Json(new { Result = "ERROR", Message = ValidationMessage.SystemError });
            }
        }

        [HttpPost]
        [Route(" ResponseBcView")]
        public ActionResult GetResponseBcView()
        {
            try
            {
                var client = new IsacClientClient();
                var ms = client.BcViewResponseStreamAsync();
                if (ms == null)
                {
                    return Json(new { success = false, Message = ValidationMessage.ErrorDownload });
                }
                else
                {
                    if (ms.Result == null)
                    {
                        return Json(new { success = false, Message = ValidationMessage.ErrorDownload });
                    }
                    var fName = string.Format(CultureInfo.CurrentCulture, "{0}.{1}", DateTime.Now.ToString("yyyyMMddhhmmss", CultureInfo.CurrentCulture), "csv");
                    HttpContext.Session.SetString(fName, ms.Result.ToString());
                    return Json(new { success = true, fName });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, Message = ValidationMessage.ErrorDownload });
            }
        }

        [HttpPost]
        [Route(" DownloadExcelReport")]
        public ActionResult DownloadExcelReport(string fName)
        {
            var ms = HttpContext.Session.Get(fName);
            if (ms == null)
                return new EmptyResult();
            HttpContext.Session.Remove(fName);
            return File(ms, "application/csv", fName);
        }

        [HttpGet]
        [Route(" LastUpdate")]
        public ActionResult Availabilty()
        {
            var result = _slaService.GetAvailabilty();
            return Ok(result);
        }

        // Get SlaRule By Id
        [HttpGet]
        [Route("  SlaOrderbyId")]
        public ActionResult GetSlaOrderbyId(int id)
        {
            var result = _slaService.GetSlaOrderbyId(id);
            return Ok(result);
        }

    }

}