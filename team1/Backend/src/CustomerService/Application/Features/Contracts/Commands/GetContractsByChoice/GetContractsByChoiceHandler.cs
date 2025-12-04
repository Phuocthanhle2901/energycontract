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
                Id = c.Id,
                ContractNumber = c.ContractNumber,

                FirstName = c.FirstName!,
                LastName = c.LastName!,

                Email = c.Email!,
                Phone = c.Phone!,

                CompanyName = c.CompanyName!,

                StartDate = c.StartDate,
                EndDate = c.EndDate,    

                BankAccountNumber = c.BankAccountNumber!,
                PdfLink = c.PdfLink!,

                AddressId = c.AddressId,
                ResellerId = c.ResellerId
            });
        }

        return result;
    }
}