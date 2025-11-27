using Application.Features.Addresses.Commands.CreateAddress;
using Application.Features.Addresses.Commands.GetAllAddresses;
using Application.Features.Addresses.Commands.DeleteAddress;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/addresses")]
public class AddressController : ControllerBase
{
    private readonly CreateAddressHandler _createAddressHandler;
    private readonly GetAllAddressesHandler _getAllAddressesHandler;
    private readonly DeleteAddressHandler _deleteAddressHandler;

    public AddressController(
        CreateAddressHandler createAddressHandler,
        GetAllAddressesHandler getAllAddressesHandler,
        DeleteAddressHandler deleteAddressHandler)
    {
        _createAddressHandler = createAddressHandler;
        _getAllAddressesHandler = getAllAddressesHandler;
        _deleteAddressHandler = deleteAddressHandler;
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateAddress command)
    {
        try
        {
            var id = await _createAddressHandler.Handle(command);
            return Ok(id);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<Address>>> GetAll([FromQuery] int limit = 0)
    {
        var query = new GetAllAddresses { Limit = limit };
        var result = await _getAllAddressesHandler.Handle(query);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _deleteAddressHandler.Handle(new DeleteAddress { Id = id });

            if (!result)
                return NotFound("Address not found");

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
}