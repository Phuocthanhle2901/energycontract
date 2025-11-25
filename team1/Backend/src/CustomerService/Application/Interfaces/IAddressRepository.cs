using Domain.Entities;

namespace Application.Interfaces;

public interface IAddressRepository
{
    Task<Address> AddAsync(Address address);
    Task<List<Address>> GetAllAsync(int limit = 0);
    Task<Address?> GetByIdAsync(int id);
    Task DeleteAsync(Address address);
}