using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.Features.Contracts.Commands.GetContract;

public class GetContractByIdHandler : IRequestHandler<GetContractById,ContractDto>
{
    private readonly IContractRepository _contractRepository;
    private readonly IMapper _mapper;

    public GetContractByIdHandler(IContractRepository contractRepository, IMapper mapper)
    {
        _contractRepository = contractRepository;
        _mapper = mapper;
    }
    
    public async Task<ContractDto> Handle(GetContractById request, CancellationToken cancellationToken)
    {
        var contractEntity = await _contractRepository.GetContractById(request.Id);
        if (contractEntity == null)
        {
            return null;
        }
        var contractDto = _mapper.Map<ContractDto>(contractEntity);
        return contractDto;
    }
}