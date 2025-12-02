using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class AddressRepository : IAddressRepository
{
    private readonly EnergyDbContext _context;
    public AddressRepository(EnergyDbContext context)
    {
        _context = context;
    }
    public async Task<Address> AddAsync(Address address)
    {
        await _context.Addresses.AddAsync(address);
        await _context.SaveChangesAsync();
        return address;
    }

    public async Task<List<Address>> GetAllAsync(int limit = 0)
    {
        var query = _context.Addresses
            .AsNoTracking()
            .OrderByDescending(c => c.Id)
            .AsQueryable();
        if (limit > 0)
        {
            query = query.Take(limit);
        }
        return await query.ToListAsync();
    }

    public async Task<Address?> GetByIdAsync(int id)
    {
        return await _context.Addresses.FindAsync(id);
    }
    public async Task UpdateAsync(Address address)
    {
        _context.Addresses.Update(address);
        await _context.SaveChangesAsync();
    }
    public async Task DeleteAsync(Address address)
    {
        _context.Addresses.Remove(address);
        await _context.SaveChangesAsync();
    }
}