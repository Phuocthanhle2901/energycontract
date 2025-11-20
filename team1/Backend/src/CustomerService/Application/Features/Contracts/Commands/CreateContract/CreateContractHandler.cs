using Application.Interfaces;
using MediatR;
using AutoMapper;
using Domain.Entities;
namespace Application.Features.Contracts.Commands.CreateContract;

public class CreateContractHandler : IRequestHandler<CreateContract, int>
{
    private readonly IContractRepository _contractRepository;
    private readonly IMapper _mapper;
    
    public CreateContractHandler(IContractRepository contractRepository, IMapper mapper)
    {
        _contractRepository = contractRepository;
        _mapper  = mapper;
    }
    public async Task<int> Handle(CreateContract request, CancellationToken cancellationToken)
    {
        var contract = _mapper.Map<Contract>(request);
        contract.ContractNumber = Guid.NewGuid().ToString().Substring(0,8).ToUpper();
        var newContract = await _contractRepository.AddContract(contract);
        return newContract.Id;
    }
}