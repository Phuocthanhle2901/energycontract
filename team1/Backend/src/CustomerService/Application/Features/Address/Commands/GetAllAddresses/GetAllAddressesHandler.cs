using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.Features.Address.Commands.GetAllAddresses;

public class GetAllAddressesHandler : IRequestHandler<GetAllAddresses, List<AddressDto>>
{
    private readonly IMapper _mapper;
    private readonly IAddressRepository _addressRepository;

    public GetAllAddressesHandler(IAddressRepository addressRepository, IMapper mapper)
    {
        _addressRepository = addressRepository;
        _mapper = mapper;
    }
    public async Task<List<AddressDto>> Handle(GetAllAddresses request, CancellationToken cancellationToken)
    {
        var addressed = await _addressRepository.GetAllAsync(request.Limit);
        return _mapper.Map<List<AddressDto>>(addressed);
    }
}