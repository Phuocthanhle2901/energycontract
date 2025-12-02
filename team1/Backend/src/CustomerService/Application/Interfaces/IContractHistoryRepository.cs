using Domain.Entities;

namespace Application.Interfaces
{
    public interface IContractHistoryRepository
    {
        Task<ContractHistory> AddAsync(ContractHistory history);
        Task<List<ContractHistory>> GetByContractIdAsync(int contractId);
    }
}