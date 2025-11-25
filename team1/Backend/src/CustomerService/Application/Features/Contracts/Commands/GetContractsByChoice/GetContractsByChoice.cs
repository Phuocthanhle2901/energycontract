using Application.DTOs;
using MediatR;

namespace Application.Features.Contracts.Commands.GetContractsByChoice;

public class GetContractsByChoice : IRequest<List<ContractDto>>
{
    public int Limit { get; set; } = 0;
}