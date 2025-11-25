using Application.DTOs;
using MediatR;

namespace Application.Features.Address.Commands.GetAllAddresses;

public class GetAllAddresses : IRequest<List<AddressDto>>
{
    public int Limit { get; set; } = 0;
}