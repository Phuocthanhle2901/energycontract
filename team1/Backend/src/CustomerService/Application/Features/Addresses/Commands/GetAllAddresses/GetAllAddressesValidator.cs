using FluentValidation;

namespace Application.Features.Addresses.Commands.GetAllAddresses
{
    public class GetAllAddressesValidator : AbstractValidator<GetAllAddresses>
    {
        public GetAllAddressesValidator()
        {
            RuleFor(x => x.Limit)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Limit must be 0 or greater.");
        }
    }
}