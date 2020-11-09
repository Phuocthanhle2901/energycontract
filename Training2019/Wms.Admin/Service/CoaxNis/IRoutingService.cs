using DomainModel.CoaxDto;
using System.Collections.Generic;
using System.Threading.Tasks;
using Common;

namespace Service.CoaxNis
{
    public interface IRoutingService
    {
        Task<string> Get(QueryParams queryParams);
        Task<string> Insert(DomainModel.Routing.RoutingModel routingModel);
        Task<string> Update(int id, DomainModel.Routing.RoutingModel routingModel);
        Task<string> Delete(int id);
        Task<string> Get(int id);
        List<string> GetNetWorkType();

        List<string> GetFiberCode();
        List<AreaResult> GetAreas();

        List<Party> GetBeheerder();

        List<Party> GetHuurder();
    }
}
