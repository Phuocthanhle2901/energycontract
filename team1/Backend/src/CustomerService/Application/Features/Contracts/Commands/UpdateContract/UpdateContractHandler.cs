using Application.Interfaces;
using Domain.Entities;
using System.Text.Json;

namespace Application.Features.Contracts.Commands.UpdateContract
{
    public class UpdateContractHandler
    {
        private readonly IContractRepository _contractRepository;
        private readonly IContractHistoryRepository _contractHistoryRepository;

        public UpdateContractHandler(
            IContractRepository contractRepository,
            IContractHistoryRepository contractHistoryRepository)
        {
            _contractRepository = contractRepository;
            _contractHistoryRepository = contractHistoryRepository;
        }

        public async Task Handle(UpdateContract request)
        {
            var contractToUpdate = await _contractRepository.GetContractById(request.Id);

            if (contractToUpdate == null)
                throw new Exception($"Contract with id {request.Id} not found");

            // 🔥 Serialize old object
            var oldValue = JsonSerializer.Serialize(contractToUpdate);

            // 🔥 Map thủ công
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

            // 🔥 Serialize new object
            var newValue = JsonSerializer.Serialize(contractToUpdate);

            // 🔥 Ghi lịch sử
            var history = new ContractHistory
            {
                OldValue = oldValue,
                NewValue = newValue,
                Timestamp = DateTime.UtcNow,
                ContractId = contractToUpdate.Id
            };

            await _contractHistoryRepository.AddAsync(history);
        }
    }
}
