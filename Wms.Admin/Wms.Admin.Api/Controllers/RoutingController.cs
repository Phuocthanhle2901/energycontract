using System;
using System.Threading.Tasks;
using AutoMapper;
using Common;
using DomainModel.CoaxDto;
using IFD.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.CoaxNis;
using Wms.Admin.Api.Attributes;

namespace Wms.Admin.Api.Controllers
{
    [Route("routing")]
    [ApiController]
    public class RoutingController : ControllerBase
    {

        private readonly IRoutingService _routingService;
        private readonly IMapper _mapper;

        public RoutingController(IRoutingService routingService, ILogger logger, IMapper mapper)
        {
            _routingService = routingService;
            _mapper = mapper;
        }

        [HttpGet]
        [FilterAcceptable]
        public async Task<ActionResult<object>> Get([FromQuery]QueryParams queryParams)
        {
            var result = await _routingService.Get(queryParams);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(Newtonsoft.Json.JsonConvert.DeserializeObject<Response<RoutingModel>>(result));
        }

        [HttpGet]
        [FilterAcceptable]
        [Route("{id}")]
        public async Task<ActionResult<object>> Get(int id)
        {
            var result = await _routingService.Get(id);
            if (result == null)
            {
                return NotFound(id);
            }
            var routing = Newtonsoft.Json.JsonConvert.DeserializeObject<RoutingModel>(result);
            return Ok(new { huurder =$"{routing.HuurderName} | {routing.HuurderSystemName}", beheerder = $"{routing.BeheerderName} | {routing.BeheerderSystemName}", area = new {id = routing.AreaId, area= routing.AreaName}});
        }
        [HttpDelete]
        [FilterAcceptable]
        public async Task<ActionResult<object>> Delete([FromQuery]int id)
        {
            var result = await _routingService.Delete(id);
            if (result == null)
            {
                return NotFound(id);
            }
            return Ok(result);
        }
        [HttpPost]
        [FilterAcceptable]
        public async Task<ActionResult<object>> Post([FromBody]DomainModel.Routing.RoutingViewModel routingViewModel)
        {
            var routingModel = _mapper.Map<DomainModel.Routing.RoutingViewModel, DomainModel.Routing.RoutingModel>(routingViewModel);
            var result = await _routingService.Insert(routingModel);
            
            return Ok(result);
        }
        [HttpPut]
        [FilterAcceptable]
        public async Task<ActionResult<object>> Put([FromQuery]int id, [FromBody]DomainModel.Routing.RoutingViewModel routingViewModel)
        {
            var routingModel = _mapper.Map<DomainModel.Routing.RoutingViewModel, DomainModel.Routing.RoutingModel>(routingViewModel);
            var result = await _routingService.Update(id, routingModel);
            if (result == null)
            {
                return NotFound(id);
            }
            return Ok(result);
        }
 

        [HttpGet]
        [Route("huurders")]
        public IActionResult GetListPartyFrom()
        {
            try
            {
                var result = _routingService.GetHuurder();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }
        [HttpGet]
        [Route("beheerders")]
        public IActionResult GetListPartyTo()
        {
            try
            {
                var result = _routingService.GetBeheerder();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        [HttpGet]
        [Route("areas")]
        public IActionResult GetListArea()
        {
            try
            {
                var result = _routingService.GetAreas();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        [HttpGet]
        [Route("routing/networktypeStatus")]
        public IActionResult GetNetWorkType()
        {
            try
            {
                var result = _routingService.GetNetWorkType();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }
        [HttpGet]
        [Route("routing/fiberCode")]
        public IActionResult GetFiberCode()
        {
            try
            {
                var result = _routingService.GetFiberCode();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }
    }
}