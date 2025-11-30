using Application.DTOs;
using Application.Features.Contracts.Commands.CreateContract;
using Application.Features.Contracts.Commands.DeleteContract;
using Application.Features.Contracts.Commands.GetContract;
using Application.Features.Contracts.Commands.GetContractsByChoice;
using Application.Features.Contracts.Commands.UpdateContract;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/contracts")]
public class ContractController : ControllerBase
{
    private readonly CreateContractHandler _createContractHandler;
    private readonly UpdateContractHandler _updateContractHandler;
    private readonly GetContractByIdHandler _getContractByIdHandler;
    private readonly GetContractsByChoiceHandler _getContractsByChoiceHandler;
    private readonly DeleteContractHandler _deleteContractHandler;
    private readonly ILogger<ContractController> _logger;

    public ContractController(
        CreateContractHandler createContractHandler,
        UpdateContractHandler updateContractHandler,
        GetContractByIdHandler getContractByIdHandler,
        GetContractsByChoiceHandler getContractsByChoiceHandler,
        DeleteContractHandler deleteContractHandler,
        ILogger<ContractController> logger
    )
    {
        _createContractHandler = createContractHandler;
        _updateContractHandler = updateContractHandler;
        _getContractByIdHandler = getContractByIdHandler;
        _getContractsByChoiceHandler = getContractsByChoiceHandler;
        _deleteContractHandler = deleteContractHandler;
        _logger = logger;
    }

    // 1. POST: Create new contract
    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateContract command)
    {
        try
        {
            var id = await _createContractHandler.Handle(command);
            _logger.LogInformation($"Created contract with id {id}");
            return CreatedAtAction(nameof(GetById), new { id = id }, id);
        }
        catch (Exception ex)
        {
            _logger.LogError("Error creating contract: {Message}", ex.Message);
            return StatusCode(500, ex.Message);
        }
    }

    // 2. PUT: Update contract
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, UpdateContract command)
    {
        if (id != command.Id)
        {
            _logger.LogError("ID in URL and Body does not match: {UrlId} != {BodyId}", id, command.Id);
            return BadRequest("ID in URL and Body does not match");
        }
        try
        {
            await _updateContractHandler.Handle(command);
            _logger.LogInformation($"Updated contract with id {command.Id}");
        }
        catch (Exception ex)
        {
            _logger.LogError("Error updating contract: {Message}", ex.Message);
            return NotFound(ex.Message);
        }

        return NoContent();
    }

    // 3. GET: Get contract details
    [HttpGet("{id}")]
    public async Task<ActionResult<ContractDto>> GetById(int id)
    {
        var result = await _getContractByIdHandler.Handle(new GetContractById { Id = id });

        if (result == null)
        {
            _logger.LogError("No contract with id {Id}", id);
            return NotFound();
        }
        _logger.LogInformation($"Retrieved contract with id {id}");
        return Ok(result);
    }

    // 4. GET: Get all contracts
    [HttpGet]
    public async Task<ActionResult<List<ContractDto>>> GetAll([FromQuery] int limit = 0)
    {
        try
        {
            if (limit < 0)
            {
                _logger.LogError("Invalid limit value: {Limit}", limit);
                return BadRequest("Limit must be non-negative");
            }
            var result = await _getContractsByChoiceHandler.Handle(new GetContractsByChoice { Limit = limit });
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError("Error processing request: {Message}", ex.Message);
            return StatusCode(500, ex.Message);
        }
      
    }
    // 5. DELETE: Delete contract
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            await _deleteContractHandler.Handle(new DeleteContract { Id = id });
            _logger.LogInformation($"Deleted contract with id {id}");
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError("Error deleting contract: {Message}", ex.Message);
            return NotFound(new { message = ex.Message });
        }
    }
}
