namespace Application.Features.Contracts.Commands.CreateContract;
using MediatR;
public class CreateContract : IRequest<int>
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public required string Phone { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string? CompanyName { get; set; }
    public string? BankAccountNumber { get; set; }
    public string? PdfLink { get; set; }
    public int ResellerId { get; set; }
    public int AddressId { get; set; }
}