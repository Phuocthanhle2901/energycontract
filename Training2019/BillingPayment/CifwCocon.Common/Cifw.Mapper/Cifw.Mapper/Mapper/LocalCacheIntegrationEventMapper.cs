using AutoMapper;
using CifwCocon.NetworkInformation.Bo;
using CifwCocon.NetworkInformation.Bo.Integration.Events;
using CifwCocon.NetworkInformation.Bo.IntegrationEvents.Events;

namespace Cifw.Mapper
{
    public class UpdateLocalCacheByCleanIntegrationEventMapper : Profile
    {
        public UpdateLocalCacheByCleanIntegrationEventMapper() : this("UpdateLocalCacheByCleanIntegrationEventMapper")
        {

        }

        public UpdateLocalCacheByCleanIntegrationEventMapper(string profileName) : base(profileName)
        {
            CreateMap<CleanCoconResponse, UpdateLocalCacheByCleanIntegrationEvent>().ReverseMap();            
        }
    }
}
