using Application.Features.Reseller.Commands.CreateReseller;
using Application.Features.Reseller.Commands.GetAllResellers;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;
[ApiController]
[Route("api/resellers")]
public class ResellerController : ControllerBase
{
    private readonly IMediator _mediator;

    public ResellerController(IMediator mediator)
    {
        _mediator = mediator;
    }
    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateReseller command)
    {
        var id = await _mediator.Send(command);
        return Ok(id); // Hoặc CreatedAtAction nếu muốn chuẩn
    }
    [HttpGet]
    public async Task<ActionResult<List<Reseller>>> GetAll([FromQuery] int limit =0)
    {
        var query = new GetAllResellers(){Limit =  limit};
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}