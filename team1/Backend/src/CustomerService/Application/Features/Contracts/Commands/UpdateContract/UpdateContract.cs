using MediatR;

namespace Application.Features.Contracts.Commands.UpdateContract;

public class UpdateContract : IRequest<Unit>
{
    public int Id { get; set; } // Bắt buộc phải có ID để biết sửa ai
    
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string? CompanyName { get; set; }
    public string? BankAccountNumber { get; set; }
    public string? PdfLink { get; set; }
    public int ResellerId { get; set; }
    public int AddressId { get; set; }
}