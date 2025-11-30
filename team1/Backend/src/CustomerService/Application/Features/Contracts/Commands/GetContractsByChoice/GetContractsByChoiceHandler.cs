using Application.DTOs;
using Application.Interfaces;

namespace Application.Features.Contracts.Commands.GetContractsByChoice;

public class GetContractsByChoiceHandler
{
    private readonly IContractRepository _contractRepository;

    public GetContractsByChoiceHandler(IContractRepository contractRepository)
    {
        _contractRepository = contractRepository;
    }

    public async Task<List<ContractDto>> Handle(GetContractsByChoice request)
    {
        var contracts = await _contractRepository.GetAllContracts(request.Limit);

        var result = new List<ContractDto>();

        foreach (var c in contracts)
        {
            result.Add(new ContractDto
            {
                ContractNumber = c.ContractNumber,
                CustomerName = $"{c.FirstName} {c.LastName}",
                Email = c.Email,
                StartDate = c.StartDate,
                Status = "Active"
            });
        }

        return result;
    }
}