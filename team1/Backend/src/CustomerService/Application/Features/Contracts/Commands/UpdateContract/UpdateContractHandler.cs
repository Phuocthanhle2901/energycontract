using Application.Interfaces;
using Domain.Entities;

namespace Application.Features.Contracts.Commands.UpdateContract;

public class UpdateContractHandler
{
    private readonly IContractRepository _contractRepository;

    public UpdateContractHandler(IContractRepository contractRepository)
    {
        _contractRepository = contractRepository;
    }

    public async Task Handle(UpdateContract request)
    {
        var contractToUpdate = await _contractRepository.GetContractById(request.Id);

        if (contractToUpdate == null)
            throw new Exception($"Contract with id {request.Id} not found");

        // 🔥 Tự map thủ công các property (không dùng AutoMapper)
        contractToUpdate.FirstName = request.FirstName;
        contractToUpdate.LastName = request.LastName;
        contractToUpdate.Email = request.Email;
        contractToUpdate.Phone = request.Phone;
        contractToUpdate.StartDate = request.StartDate;
        contractToUpdate.EndDate = request.EndDate;
        contractToUpdate.CompanyName = request.CompanyName;
        contractToUpdate.BankAccountNumber = request.BankAccountNumber;
        contractToUpdate.PdfLink = request.PdfLink;
        contractToUpdate.ResellerId = request.ResellerId;
        contractToUpdate.AddressId = request.AddressId;

        await _contractRepository.UpdateContract(contractToUpdate);
    }
}