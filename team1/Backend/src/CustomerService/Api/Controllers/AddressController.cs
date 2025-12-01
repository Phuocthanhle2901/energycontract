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
    private readonly ILogger<AddressController> _logger;
    public AddressController(
        CreateAddressHandler createAddressHandler,
        GetAllAddressesHandler getAllAddressesHandler,
        DeleteAddressHandler deleteAddressHandler,
        ILogger<AddressController> logger)
    {
        _createAddressHandler = createAddressHandler;
        _getAllAddressesHandler = getAllAddressesHandler;
        _deleteAddressHandler = deleteAddressHandler;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateAddress command)
    {
        try
        {
            var id = await _createAddressHandler.Handle(command);
            _logger.LogInformation($"Created address with id {id}");
            return Ok(id);
        }
        catch (Exception ex)
        {
            _logger.LogError("Error creating address: {Message}", ex.Message);
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<Address>>> GetAll([FromQuery] int limit = 0)
    {
        try
        {
            if (limit < 0)
            {
                _logger.LogError("Invalid limit parameter: {Limit}", limit);
                return BadRequest("Limit must be a non-negative integer");
            }
                
            var query = new GetAllAddresses { Limit = limit };
            var result = await _getAllAddressesHandler.Handle(query);
            _logger.LogInformation($"Retrieved {result.Count} addresses");
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError("Error in GetAll: {Message}", ex.Message);
            return StatusCode(500, ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            
            var result = await _deleteAddressHandler.Handle(new DeleteAddress { Id = id });
            if (!result)
            {
                _logger.LogError("Failed to delete address with id {Id}", id);
                return NotFound("Address not found");
            }
            _logger.LogInformation($"Deleted address with id {id}");
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
}