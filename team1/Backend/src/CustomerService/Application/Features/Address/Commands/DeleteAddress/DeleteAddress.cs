using MediatR;

namespace Application.Features.Address.Commands.DeleteAddress
{
    public class DeleteAddress : IRequest<bool>
    {
        public int Id { get; set; }
    }
}