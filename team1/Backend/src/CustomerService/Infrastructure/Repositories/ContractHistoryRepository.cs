using Application.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;

namespace Infrastructure.Repositories
{
    public class ContractHistoryRepository : IContractHistoryRepository
    {
        private readonly EnergyDbContext _context;

        public ContractHistoryRepository(EnergyDbContext context)
        {
            _context = context;
        }

        public async Task<ContractHistory> AddAsync(ContractHistory history)
        {
            await _context.ContractHistories.AddAsync(history);
            await _context.SaveChangesAsync();
            return history;
        }

        public async Task<List<ContractHistory>> GetByContractIdAsync(int contractId)
        {
            return await _context.ContractHistories
                .Where(h => h.ContractId == contractId)
                .OrderByDescending(h => h.Timestamp)
                .ToListAsync();
        }
    }
}