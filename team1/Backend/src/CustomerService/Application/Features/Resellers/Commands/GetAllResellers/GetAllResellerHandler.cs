using Application.DTOs;
using Application.Interfaces;

namespace Application.Features.Resellers.Commands.GetAllResellers
{
    public class GetAllResellerHandler
    {
        private readonly IResellerRepository _resellerRepository;

        public GetAllResellerHandler(IResellerRepository resellerRepository)
        {
            _resellerRepository = resellerRepository;
        }

        public async Task<List<ResellerDto>> Handle(GetAllResellers request)
        {
            var resellers = await _resellerRepository.GetAllAsync(request.Limit);

            return resellers.Select(x => new ResellerDto
            {
                Id = x.Id,
                Name = x.Name,
                Type = x.Type
            }).ToList();
        }
    }
}