using Domain.Entities;

namespace Application.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order> AddAsync(Order order);
        Task<List<Order>> GetAllAsync(int limit = 0);
        Task<Order?> GetByIdAsync(int id);
        Task UpdateAsync(Order order);
        Task DeleteAsync(Order order);
    }
}