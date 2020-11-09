using AutoMapper;
using DomainModel.CoconMapping;

namespace Service.Map
{
    public class CoconMappingProfile:Profile 
    {
        public CoconMappingProfile()
        {
            CreateMap<CoconMappingData,Entities.CoconMapping.CoconMapping>();
        }
    }
}
