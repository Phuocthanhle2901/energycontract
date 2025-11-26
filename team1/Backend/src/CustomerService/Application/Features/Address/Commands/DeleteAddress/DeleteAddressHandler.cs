using Application.Interfaces;
using MediatR;

namespace Application.Features.Address.Commands.DeleteAddress
{
    public class DeleteAddressHandler : IRequestHandler<DeleteAddress, bool>
    {
        private readonly IAddressRepository _addressRepository;

        public DeleteAddressHandler(IAddressRepository addressRepository)
        {
            _addressRepository = addressRepository;
        }

        public async Task<bool> Handle(DeleteAddress request, CancellationToken cancellationToken)
        {
            var address = await _addressRepository.GetByIdAsync(request.Id);

            if (address == null)
                return false;

            await _addressRepository.DeleteAsync(address);

            return true;
        }
    }
}