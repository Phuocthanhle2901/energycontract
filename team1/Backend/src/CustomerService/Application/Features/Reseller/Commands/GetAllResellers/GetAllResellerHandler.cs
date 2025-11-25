using Application.DTOs;
using Application.Interfaces;
using AutoMapper;
using MediatR;

namespace Application.Features.Reseller.Commands.GetAllResellers;

public class GetAllResellerHandler : IRequestHandler<GetAllResellers,List<ResellerDto>>
{
    private readonly IResellerRepository _resellerRepository;
    private readonly IMapper _mapper;

    public GetAllResellerHandler(IResellerRepository resellerRepository, IMapper mapper)
    {
        _resellerRepository = resellerRepository;
        _mapper = mapper;
    }
    public async Task<List<ResellerDto>> Handle(GetAllResellers request, CancellationToken cancellationToken)
    {
        var resellers = await _resellerRepository.GetAllAsync(request.Limit);
        return _mapper.Map<List<ResellerDto>>(resellers);
    }
}