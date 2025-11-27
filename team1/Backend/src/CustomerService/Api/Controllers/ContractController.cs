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

    public ContractController(
        CreateContractHandler createContractHandler,
        UpdateContractHandler updateContractHandler,
        GetContractByIdHandler getContractByIdHandler,
        GetContractsByChoiceHandler getContractsByChoiceHandler,
        DeleteContractHandler deleteContractHandler
    )
    {
        _createContractHandler = createContractHandler;
        _updateContractHandler = updateContractHandler;
        _getContractByIdHandler = getContractByIdHandler;
        _getContractsByChoiceHandler = getContractsByChoiceHandler;
        _deleteContractHandler = deleteContractHandler;
    }

    // 1. POST: Create new contract
    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateContract command)
    {
        try
        {
            var id = await _createContractHandler.Handle(command);
            return CreatedAtAction(nameof(GetById), new { id = id }, id);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    // 2. PUT: Update contract
    [HttpPut("{id}")]
    public async Task<ActionResult> Update(int id, UpdateContract command)
    {
        if (id != command.Id)
            return BadRequest("ID in URL and Body does not match");

        try
        {
            await _updateContractHandler.Handle(command);
        }
        catch (Exception ex)
        {
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
            return NotFound();

        return Ok(result);
    }

    // 4. GET: Get all contracts
    [HttpGet]
    public async Task<ActionResult<List<ContractDto>>> GetAll([FromQuery] int limit = 0)
    {
        var result = await _getContractsByChoiceHandler.Handle(new GetContractsByChoice { Limit = limit });
        return Ok(result);
    }

    // 5. DELETE: Delete contract
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            await _deleteContractHandler.Handle(new DeleteContract { Id = id });
            return NoContent();
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
