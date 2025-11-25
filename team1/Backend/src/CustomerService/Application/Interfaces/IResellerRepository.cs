using Domain.Entities;

namespace Application.Interfaces;

public interface IResellerRepository
{
    Task<Reseller> AddAsync(Reseller reseller);
    Task<List<Reseller>> GetAllAsync(int limit = 0);
    Task<Reseller?> GetByIdAsync(int id);
    Task DeleteAsync(Reseller reseller);
}