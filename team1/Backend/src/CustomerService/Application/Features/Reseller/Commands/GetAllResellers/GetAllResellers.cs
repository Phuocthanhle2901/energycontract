using Application.DTOs;
using MediatR;

namespace Application.Features.Reseller.Commands.GetAllResellers;

public class GetAllResellers : IRequest<List<ResellerDto>>
{
    public int Limit { get; set; } = 0;
}