using AutoMapper;
using Common;
using DomainModel.CoconMapping;
using IFD.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.CoconMapping;
using System;
using System.Linq;

namespace Wms.Admin.Api.Controllers
{
    [Route("coconmapping")]
    [ApiController]
    public class CoconMappingController : ControllerBase
    {
        private readonly ICoconMappingService _coconMappingService;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;
        public CoconMappingController(ICoconMappingService coconMappingService, ILogger logger,IMapper mapper)
        {
            _coconMappingService = coconMappingService;
            _logger = logger;
            _mapper = mapper;
        }
        [HttpGet]
        public IActionResult Get([FromQuery] int page, [FromQuery] int pageSize)
        {
            try
            {
                var data = _coconMappingService.GetAll(page, pageSize);
                _logger.LogException(LoggingEnum.UDR0029);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        [HttpPut]
        public IActionResult Put([FromQuery]int id, [FromBody] CoconMappingData destination)
        {
            try
            {
                _coconMappingService.Update(id, destination);
                _logger.LogException(LoggingEnum.UDR0030);
                return StatusCode(200);
            }
            catch (Exception ex)
            {
                _logger.LogException(LoggingEnum.UDR0031,ex);
                return StatusCode(500, "Update cocon_mapping failed!. Please contact to administrator");
            }
        }
        [HttpDelete]
        public IActionResult Delete([FromQuery]int id)
        {
            try
            {
                _coconMappingService.Delete(id);
                _logger.LogException(LoggingEnum.UDR0032);
                return StatusCode(200);
            }
            catch (Exception ex)
            {
                _logger.LogException(LoggingEnum.UDR0033,ex);
                return StatusCode(500, "Delete cocon_mapping failed!. Please contact to administrator");
            }
        }

        // GET Party Huurder and Beheerder
        [HttpGet]
        [Route("party")]
        public IActionResult GetParty()
        {
            try
            {
                var result = _coconMappingService.GetParty().ToList();
                _logger.LogException(LoggingEnum.UDR0034);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }

        // GET coconmapping 
        [HttpGet]
        [Route("coconmapping")]
        public IActionResult Get(int id)
        {
            try
            {
                var result = _coconMappingService.Get(id);
                _logger.LogException(LoggingEnum.UDR0035);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }
        [HttpPost]
        public IActionResult Post([FromBody]CoconMappingData coconMappingData)
        {
            try
            {
                var coconMappingModel = _mapper.Map<CoconMappingData, Entities.CoconMapping.CoconMapping>(coconMappingData);
                _coconMappingService.Insert(coconMappingModel);
                _logger.LogException(LoggingEnum.UDR0036);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }

        }
    }
}