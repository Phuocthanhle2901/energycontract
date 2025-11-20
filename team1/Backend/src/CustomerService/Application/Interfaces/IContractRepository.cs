using Domain.Entities;

namespace Application.Interfaces;

public interface IContractRepository
{
    Task<Contract> AddContract(Contract contract);
    Task<Contract?> GetContractById(int id);
    Task UpdateContract(Contract contract);
    Task DeleteContract(Contract contract); 
}