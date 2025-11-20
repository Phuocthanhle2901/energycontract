using Application.Interfaces;
using MediatR;

namespace Application.Features.Contracts.Commands.DeleteContract;

public class DeleteContractHandler : IRequestHandler<DeleteContract, Unit>
{
    private readonly IContractRepository _contractRepository;
    public DeleteContractHandler(IContractRepository contractRepository)
    {
        _contractRepository = contractRepository;
    }

    public async Task<Unit> Handle(DeleteContract request, CancellationToken cancellationToken)
    {
        var contractToDelete = await _contractRepository.GetContractById(request.Id);
        if (contractToDelete == null)
        {
            throw new Exception($"Contract with id {request.Id} not found");
        }
        await _contractRepository.DeleteContract(contractToDelete);
        return Unit.Value;
    }
}