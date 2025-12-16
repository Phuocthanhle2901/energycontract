using Application.DTOs;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;
using Infrastructure.Persistence;
using MassTransit;
using Microsoft.Extensions.Logging;
using Shared.Events;
using System.Text.Json;
using System.Text.Json.Serialization;
using Api.Common.Messaging.Contracts;

namespace Infrastructure.Repositories;

public class ContractRepository : IContractRepository
{
    private readonly EnergyDbContext _dbContext;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly ILogger<ContractRepository> _logger;
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        ReferenceHandler = ReferenceHandler.IgnoreCycles,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };
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
                CreatedAt = DateTime.UtcNow,
                FinishedAt = contract.EndDate
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
            .Include(c=> c.Orders)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task UpdateContract(Contract contract)
    {
        // 1) lấy bản cũ trước khi update
        var oldContract = await _dbContext.Contracts
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == contract.Id);

        var oldJson = oldContract == null ? null : JsonSerializer.Serialize(oldContract, JsonOptions);

        // 2) update + save
        _dbContext.Contracts.Update(contract);
        await _dbContext.SaveChangesAsync();

        // 3) lấy bản mới sau khi update (đảm bảo đúng dữ liệu DB)
        var newContract = await _dbContext.Contracts
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == contract.Id);

        var newJson = newContract == null ? null : JsonSerializer.Serialize(newContract, JsonOptions);

        // 4) publish event
        try
        {
            await _publishEndpoint.Publish(new ContractChangedEvent
            {
                ContractId = contract.Id,
                Action = "Updated",
                OldValue = oldJson,
                NewValue = newJson,
                Timestamp = DateTime.UtcNow,
                ChangedBy = null,
                CorrelationId = null
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Publish ContractChangedEvent (Updated) failed");
        }
    }


    public async Task DeleteContract(Contract contract)
{
    // 1) lấy bản cũ trước khi xóa
    var oldContract = await _dbContext.Contracts
        .AsNoTracking()
        .FirstOrDefaultAsync(c => c.Id == contract.Id);

    var oldJson = oldContract == null ? null : JsonSerializer.Serialize(oldContract, JsonOptions);

    // 2) delete + save
    _dbContext.Contracts.Remove(contract);
    await _dbContext.SaveChangesAsync();

    // 3) publish event
    try
    {
        await _publishEndpoint.Publish(new ContractChangedEvent
        {
            ContractId = contract.Id,
            Action = "Deleted",
            OldValue = oldJson,
            NewValue = null,
            Timestamp = DateTime.UtcNow,
            ChangedBy = null,
            CorrelationId = null
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Publish ContractChangedEvent (Deleted) failed");
    }
}

    public async Task<List<Contract>> GetAllContracts(int limit = 0)
    {
        var query = _dbContext.Contracts
            .Include(c => c.Address)
            .Include(c => c.Reseller)
            .Include(c=> c.Orders)
            .AsNoTracking()
            .OrderByDescending(c => c.Id)
            .AsQueryable();
        if (limit > 0)
        {
            query = query.Take(limit);
        }
        return await query.ToListAsync();
    }
    public async Task<(List<Contract> Items, int TotalCount)> GetPagedContractsAsync(
    string? search,
    int? resellerId,
    DateTime? startDateFrom,
    DateTime? startDateTo,
    int pageNumber,
    int pageSize,
    string? sortBy,
    bool sortDesc)
{
    var query = _dbContext.Contracts
        .Include(c => c.Address)
        .Include(c => c.Reseller)
        .AsNoTracking()
        .AsQueryable();

    if (!string.IsNullOrWhiteSpace(search))
    {
        search = search.Trim().ToLower();
        query = query.Where(c =>
            c.ContractNumber.ToLower().Contains(search) ||
            c.FirstName.ToLower().Contains(search) ||
            c.LastName.ToLower().Contains(search) ||
            c.Email.ToLower().Contains(search) ||
            c.Phone.ToLower().Contains(search));
    }

    if (resellerId.HasValue)
        query = query.Where(c => c.ResellerId == resellerId.Value);

    if (startDateFrom.HasValue)
        query = query.Where(c => c.StartDate >= startDateFrom.Value);

    if (startDateTo.HasValue)
        query = query.Where(c => c.StartDate <= startDateTo.Value);

    // SORT
    query = (sortBy?.ToLower(), sortDesc) switch
    {
        ("contractnumber", false) => query.OrderBy(c => c.ContractNumber),
        ("contractnumber", true)  => query.OrderByDescending(c => c.ContractNumber),
        ("startdate", false)      => query.OrderBy(c => c.StartDate),
        ("startdate", true)       => query.OrderByDescending(c => c.StartDate),
        ("customername", false)   => query.OrderBy(c => c.FirstName).ThenBy(c => c.LastName),
        ("customername", true)    => query.OrderByDescending(c => c.FirstName).ThenByDescending(c => c.LastName),
        _                         => sortDesc ? query.OrderByDescending(c => c.Id) : query.OrderBy(c => c.Id),
    };

    var totalCount = await query.CountAsync();

    var items = await query
        .Skip((pageNumber - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    return (items, totalCount);
}

    // Thêm hàm này vào cuối class
    public async Task<Contract?> GetContractByNumberAsync(string contractNumber)
    {
        return await _dbContext.Contracts
            .FirstOrDefaultAsync(c => c.ContractNumber == contractNumber);
    }
    public async Task<List<Contract>> GetContractsByEmailAsync(string email) 
    {
        return await _dbContext.Contracts
            .Include(c => c.Address)
            .Include(c => c.Reseller)
            // 2. Dùng Where để lọc tất cả, thay vì FirstOrDefault
            .Where(c => c.Email == email) 
            // 3. Dùng ToListAsync để trả về danh sách
            .ToListAsync(); 
    }
}