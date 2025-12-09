using Domain.Entities;

namespace Application.Interfaces;

public interface IResellerRepository
{
    Task<Reseller> AddAsync(Reseller reseller);
    Task<List<Reseller>> GetAllAsync(int limit = 0);
    Task<Reseller?> GetByIdAsync(int id);
    Task UpdateAsync(Reseller reseller);
    Task DeleteAsync(Reseller reseller);
}