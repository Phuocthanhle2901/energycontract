using Application.DTOs;
using Application.Interfaces;

namespace Application.Features.Contracts.Commands.GetContractByEmail;

public class GetMyContractsHandler
{
    private readonly IContractRepository _contractRepository;

    public GetMyContractsHandler(IContractRepository contractRepository)
    {
        _contractRepository = contractRepository;
    }

    public async Task<List<ContractDto>> Handle(string email)
    {
        // 👇 SỬA TÊN HÀM Ở ĐÂY CHO KHỚP VỚI REPOSITORY
        var contractEntities = await _contractRepository.GetContractsByEmailAsync(email);

        var contractDtos = new List<ContractDto>();

        foreach (var entity in contractEntities)
        {
            var dto = new ContractDto
            {
                Id = entity.Id,
                ContractNumber = entity.ContractNumber,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                Email = entity.Email,
                Phone = entity.Phone,
                CompanyName = entity.CompanyName,
                StartDate = entity.StartDate,
                EndDate = entity.EndDate,
                BankAccountNumber = entity.BankAccountNumber,
                PdfLink = entity.PdfLink,
                AddressId = entity.AddressId,
                ResellerId = entity.ResellerId,

                // Map Address (Xử lý null)
                AddressHouseNumber = entity.Address?.HouseNumber,
                AddressZipCode = entity.Address?.ZipCode,
                
                // Map Reseller (Xử lý null)
                ResellerName = entity.Reseller?.Name,
                ResellerType = entity.Reseller?.Type.ToString(), 

                // Map Orders
                Orders = entity.Orders.Select(o => new OrderDto
                {
                    Id = o.Id,
                    OrderNumber = o.OrderNumber,
                    OrderType = o.OrderType,
                    Status = o.Status,
                    StartDate = o.StartDate,
                    EndDate = o.EndDate,
                    TopupFee = o.TopupFee,
                    ContractId = o.ContractId
                }).ToList()
            };

            contractDtos.Add(dto);
        }

        return contractDtos;
    }
}