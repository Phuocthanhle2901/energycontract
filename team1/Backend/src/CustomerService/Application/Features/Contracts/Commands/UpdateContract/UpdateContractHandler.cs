using Application.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.Features.Contracts.Commands.UpdateContract;

public class UpdateContractHandler : IRequestHandler<UpdateContract, Unit>
{
    private readonly IContractRepository _contractRepository;
    private readonly IMapper _mapper;
    
    public UpdateContractHandler(IContractRepository contractRepository, IMapper mapper)
    {
        _contractRepository = contractRepository;
        _mapper = mapper;
    }

    public async Task<Unit> Handle(UpdateContract request, CancellationToken cancellationToken)
    {
        var contractToUpdate = await _contractRepository.GetContractById(request.Id);
        if (contractToUpdate == null)
        {
            throw new Exception($"Contract with id {request.Id} not found");
        }

        _mapper.Map(request, contractToUpdate);
        await _contractRepository.UpdateContract(contractToUpdate);
        return Unit.Value; // báo hiệu thành công
    }
}