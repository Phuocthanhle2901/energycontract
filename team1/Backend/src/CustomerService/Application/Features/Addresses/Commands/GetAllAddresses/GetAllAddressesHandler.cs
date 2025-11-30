using Application.DTOs;
using Application.Interfaces;

namespace Application.Features.Addresses.Commands.GetAllAddresses;

public class GetAllAddressesHandler
{
    private readonly IAddressRepository _addressRepository;

    public GetAllAddressesHandler(IAddressRepository addressRepository)
    {
        _addressRepository = addressRepository;
    }

    public async Task<List<AddressDto>> Handle(GetAllAddresses request)
    {
        var addresses = await _addressRepository.GetAllAsync(request.Limit);

        var result = new List<AddressDto>();

        foreach (var a in addresses)
        {
            result.Add(new AddressDto
            {
                Id = a.Id,
                ZipCode = a.ZipCode,
                HouseNumber = a.HouseNumber,
                Extension = a.Extension
            });
        }

        return result;
    }
}