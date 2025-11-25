using Application.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.Features.Address.Commands.CreateAddress;

public class CreateAddressHandler : IRequestHandler<CreateAddress, int>
{
    private readonly IAddressRepository _addressRepository;
    private readonly IMapper _mapper;

    public CreateAddressHandler(IAddressRepository addressRepository, IMapper mapper)
    {
        _addressRepository = addressRepository;
        _mapper = mapper;
    }
    
    public async Task<int> Handle(CreateAddress request, CancellationToken cancellationToken)
    {
        var address = _mapper.Map<Domain.Entities.Address>(request);
        await _addressRepository.AddAsync(address);
        return address.Id;
    }
}