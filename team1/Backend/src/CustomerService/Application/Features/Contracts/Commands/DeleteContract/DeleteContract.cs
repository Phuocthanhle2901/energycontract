using MediatR;

namespace Application.Features.Contracts.Commands.DeleteContract;

public class DeleteContract : IRequest<Unit>
{
    public int Id { get; set; }
}