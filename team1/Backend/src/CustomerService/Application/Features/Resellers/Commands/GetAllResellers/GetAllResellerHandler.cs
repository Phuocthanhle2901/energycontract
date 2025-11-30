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

            var result = new List<ResellerDto>();

            foreach (var r in resellers)
            {
                result.Add(new ResellerDto
                {
                    Id = r.Id,
                    Name = r.Name,
                    Type = r.Type
                });
            }

            return result;
        }
    }
}