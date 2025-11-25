using Application.Features.Address.Commands.CreateAddress;
using Application.Features.Address.Commands.GetAllAddresses;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;
[ApiController]
[Route("api/addresses")]
public class AddressController : ControllerBase
{
    private readonly IMediator _mediator;
    
    public AddressController(IMediator mediator)
    {
        _mediator = mediator;
    }
    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateAddress command)
    {
        try
        {
            var id = await _mediator.Send(command);
            
            return Ok(id);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
       
    }
    [HttpGet]
    public async Task<ActionResult<List<Address>>> GetAll([FromQuery] int limit =0)
    {
        var query = new GetAllAddresses{Limit =  limit};
        var result = await _mediator.Send(query);
        return Ok(result);
    }
    
}