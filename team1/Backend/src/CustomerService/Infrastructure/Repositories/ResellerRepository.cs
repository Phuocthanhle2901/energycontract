using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ResellerRepository : IResellerRepository
{
    private readonly EnergyDbContext _context;

    public ResellerRepository(EnergyDbContext context)
    {
        _context = context;
    }
    public async Task UpdateAsync(Reseller reseller)
    {
        _context.Resellers.Update(reseller);
        await _context.SaveChangesAsync();
    }
    public async Task<Reseller> AddAsync(Reseller reseller)
    {
        await _context.Resellers.AddAsync(reseller);
        await _context.SaveChangesAsync();
        return reseller;
    }

    public async Task<List<Reseller>> GetAllAsync(int limit = 0)
    {
        var query = _context.Resellers
            .AsNoTracking()
            .OrderByDescending(c => c.Id)
            .AsQueryable();
        if (limit > 0)
        {
            query = query.Take(limit);
        }
        return await query.ToListAsync();
    }
    
    public async Task<Reseller?> GetByIdAsync(int id)
    {
        return await _context.Resellers.FindAsync(id);
    }

    public async Task DeleteAsync(Reseller reseller)
    {
        _context.Resellers.Remove(reseller);
        await _context.SaveChangesAsync();
    }
}