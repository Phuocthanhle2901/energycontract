using Application.DTOs;
using MediatR;

namespace Application.Features.Contracts.Commands.GetContract;

public class GetContractById : IRequest<ContractDto>
{
    public int Id { get; set; }
}