using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.Features.Contracts.Commands.GetContractsByChoice;

public class GetContractsByChoiceHandler : IRequestHandler<GetContractsByChoice, List<ContractDto>>
{
    private readonly IContractRepository _contractRepository;
    private readonly IMapper _mapper;

    public GetContractsByChoiceHandler(IContractRepository contractRepository, IMapper mapper)
    {
        _contractRepository = contractRepository;
        _mapper = mapper;
    }
    public async Task<List<ContractDto>> Handle(GetContractsByChoice request, CancellationToken cancellationToken)
    {
        var contracts = await _contractRepository.GetAllContracts(request.Limit);
        return _mapper.Map<List<ContractDto>>(contracts);
    }
}