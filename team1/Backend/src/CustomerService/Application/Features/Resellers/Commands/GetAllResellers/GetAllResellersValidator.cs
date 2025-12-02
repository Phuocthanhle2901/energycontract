using FluentValidation;

namespace Application.Features.Resellers.Commands.GetAllResellers
{
    public class GetAllResellersValidator : AbstractValidator<GetAllResellers>
    {
        public GetAllResellersValidator()
        {
            RuleFor(x => x.Limit).GreaterThanOrEqualTo(0);
        }
    }
}