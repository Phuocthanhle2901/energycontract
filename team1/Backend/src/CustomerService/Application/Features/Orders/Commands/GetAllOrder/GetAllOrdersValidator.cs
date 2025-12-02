using FluentValidation;

namespace Application.Features.Orders.Commands.GetAllOrders
{
    public class GetAllOrdersValidator : AbstractValidator<GetAllOrders>
    {
        public GetAllOrdersValidator()
        {
            RuleFor(x => x.Limit).GreaterThanOrEqualTo(0);
        }
    }
}