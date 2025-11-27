using Application.DTOs;
using Application.Features.Resellers.Commands.CreateReseller;
using Application.Features.Resellers.Commands.GetAllResellers;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/resellers")]
    public class ResellerController : ControllerBase
    {
        private readonly CreateResellerHandler _createResellerHandler;
        private readonly GetAllResellerHandler _getAllResellerHandler;

        public ResellerController(
            CreateResellerHandler createResellerHandler,
            GetAllResellerHandler getAllResellerHandler)
        {
            _createResellerHandler = createResellerHandler;
            _getAllResellerHandler = getAllResellerHandler;
        }

        [HttpPost]
        public async Task<ActionResult<int>> Create(CreateReseller command)
        {
            var id = await _createResellerHandler.Handle(command);
            return Ok(id);
        }

        [HttpGet]
        public async Task<ActionResult<List<ResellerDto>>> GetAll([FromQuery] int limit = 0)
        {
            var query = new GetAllResellers { Limit = limit };
            var result = await _getAllResellerHandler.Handle(query);
            return Ok(result);
        }
    }
}