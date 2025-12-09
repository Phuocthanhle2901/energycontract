using Application.Interfaces;
using Application.DTOs;

namespace Application.Features.ContractHistories.Commands.GetHistoryByContractId
{
    public class GetHistoryByContractIdHandler
    {
        private readonly IContractHistoryRepository _repository;

        public GetHistoryByContractIdHandler(IContractHistoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<ContractHistoryDto>> Handle(GetHistoryByContractId request)
        {
            var list = await _repository.GetByContractIdAsync(request.ContractId);

            return list.Select(h => new ContractHistoryDto
            {
                Id = h.Id,
                OldValue = h.OldValue,
                NewValue = h.NewValue,
                Timestamp = h.Timestamp,
                ContractId = h.ContractId
            }).ToList();
        }
    }
}