using Application.Features.Contracts.Commands.CreateContract;
using FluentValidation;

namespace Application.Features.Reseller.Commands.CreateReseller;

public class CreateResellerValidator: AbstractValidator<CreateReseller>
{
   public CreateResellerValidator()
   {
      RuleFor(p => p.Name)
         .NotEmpty().WithMessage("{PropertyName} is required.")
         .NotNull()
         .MaximumLength(50).WithMessage("{PropertyName} must not exceed 50 characters.");

      RuleFor(p => p.Type)
         .NotEmpty().WithMessage("{PropertyName} is required.")
         .NotNull();
   }
}