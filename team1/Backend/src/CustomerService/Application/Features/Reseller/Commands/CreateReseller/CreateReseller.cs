using MediatR;

namespace Application.Features.Reseller.Commands.CreateReseller;

public class CreateReseller : IRequest<int>
{
    public string Name { get; set; }
    public string Type { get; set; }
}