namespace Application.DTOs;

public class ContractDto
{
    public string ContractNumber { get; set; }
    public string CustomerName { get; set; }
    public string Email { get; set; }
    public DateTime StartDate { get; set; }
    public string Status { get; set; } = "Active";
}