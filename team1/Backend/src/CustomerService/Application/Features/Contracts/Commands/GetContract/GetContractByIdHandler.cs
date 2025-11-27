using Application.DTOs;
using Application.Interfaces;

namespace Application.Features.Contracts.Commands.GetContract;

public class GetContractByIdHandler
{
    private readonly IContractRepository _contractRepository;

    public GetContractByIdHandler(IContractRepository contractRepository)
    {
        _contractRepository = contractRepository;
    }

    public async Task<ContractDto?> Handle(GetContractById request)
    {
        var contractEntity = await _contractRepository.GetContractById(request.Id);

        if (contractEntity == null)
            return null;

        // 🔥 Map thủ công Contract → ContractDto
        var dto = new ContractDto
        {
            ContractNumber = contractEntity.ContractNumber,
            CustomerName = $"{contractEntity.FirstName} {contractEntity.LastName}",
            Email = contractEntity.Email,
            StartDate = contractEntity.StartDate,
            Status = "Active" // giữ nguyên default từ DTO
        };

        return dto;
    }
}