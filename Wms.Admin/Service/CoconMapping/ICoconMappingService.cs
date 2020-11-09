using DomainModel.CoconMapping;
using System.Collections.Generic;

namespace Service.CoconMapping
{
    public interface ICoconMappingService
    {
        CoconMappingResult GetAll(int page, int pageSize);
        CoconMappingData Get(int id);
        void Update(int id, CoconMappingData coconMappingData);
        void Delete(int id);
        void Insert(Entities.CoconMapping.CoconMapping coconMappingData);
        List<Party> GetParty();
    }
}
