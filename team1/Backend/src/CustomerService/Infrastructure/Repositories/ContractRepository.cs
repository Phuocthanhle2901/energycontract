using Application.DTOs;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Infrastructure.Persistence;
using MassTransit;
using Microsoft.Extensions.Logging;
using Shared.Events;

namespace Infrastructure.Repositories;

public class ContractRepository : IContractRepository
{
    private readonly EnergyDbContext _dbContext;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly ILogger<ContractRepository> _logger;
    public ContractRepository(EnergyDbContext dbContext, IPublishEndpoint publishEndpoint, ILogger<ContractRepository> logger)
    {
        _dbContext = dbContext; 
        _publishEndpoint = publishEndpoint;
        _logger = logger;
    }

    public async Task<Contract> AddContract(Contract contract)
    {
        await  _dbContext.Contracts.AddAsync(contract);
        await _dbContext.SaveChangesAsync();
        try
        {
            _logger.LogWarning("Starting connnect to RabbitMQ to publish ContractCreatedEvent");
            await _publishEndpoint.Publish(new ContractCreatedEvent
            {
                ContractNumber = contract.ContractNumber,
                Email = contract.Email,
                FullName = $"{contract.FirstName} {contract.LastName}",
                CreatedAt = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message);
        }
      
        return contract;
    }

    public async Task<Contract?> GetContractById(int id)
    {
        return await _dbContext.Contracts
            .Include(c => c.Address)
            .Include(c => c.Reseller)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task UpdateContract(Contract contract)
    {
        _dbContext.Contracts.Update(contract);
        await _dbContext.SaveChangesAsync();
    }


    public async Task DeleteContract(Contract contract)
    {
        _dbContext.Contracts.Remove(contract);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<List<Contract>> GetAllContracts(int limit = 0)
    {
        var query = _dbContext.Contracts
            .Include(c => c.Address)
            .Include(c => c.Reseller)
            .AsNoTracking()
            .OrderByDescending(c => c.Id)
            .AsQueryable();
        if (limit > 0)
        {
            query = query.Take(limit);
        }
        return await query.ToListAsync();
    }
}