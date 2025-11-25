using Application.Interfaces;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Features.Reseller.Commands.CreateReseller;

public class CreateResellerHandler : IRequestHandler<CreateReseller, int>
{
    private readonly IResellerRepository _resellerRepository;
    private readonly IMapper _mapper;

    public CreateResellerHandler(IResellerRepository resellerRepository, IMapper mapper)
    {
        _resellerRepository = resellerRepository;
        _mapper = mapper;
    }
    
    public async Task<int> Handle(CreateReseller request, CancellationToken cancellationToken)
    {
        var reseller = _mapper.Map<Domain.Entities.Reseller>(request);
        await _resellerRepository.AddAsync(reseller);
        return reseller.Id;
    }
}