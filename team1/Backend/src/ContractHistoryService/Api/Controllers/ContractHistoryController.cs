using Api.Infrastructures.Persistence;
using Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContractHistoryController : ControllerBase
{
    private readonly ContractHistoryDbContext _dbContext;

    public ContractHistoryController(ContractHistoryDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Get contract history by id
    /// </summary>
    /// <param name="id">ContractHistory Id</param>
    /// <returns>ContractHistory</returns>
    [HttpGet("{id:long}")]
    [ProducesResponseType(typeof(ContractHistory), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(long id)
    {
        var history = await _dbContext.ContractHistories
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (history == null)
        {
            return NotFound();
        }

        return Ok(history);
    }
    [HttpGet("by-contract/{contractId:int}")]
    [ProducesResponseType(typeof(List<ContractHistory>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByContractId(int contractId)
    {
        var items = await _dbContext.ContractHistories
            .AsNoTracking()
            .Where(x => x.ContractId == contractId)
            .OrderByDescending(x => x.Timestamp)
            .ToListAsync();

        return Ok(items);
    }
}