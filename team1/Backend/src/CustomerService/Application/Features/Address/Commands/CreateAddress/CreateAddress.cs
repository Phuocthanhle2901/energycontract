using MediatR;

namespace Application.Features.Address.Commands.CreateAddress;

public class CreateAddress : IRequest<int>
{
    public string ZipCode { get; set; } =  string.Empty;
    public string HouseNumber { get; set; } = string.Empty;
    public string? Extension  { get; set; }
}