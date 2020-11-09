using AutoMapper;
using CifwCocon.NetworkInformation.Bo;
using CifwCocon.NetworkInformation.Bo.IntegrationEvents.Events;

namespace Cifw.Mapper.WritePatch
{
    public class WritePatchIntegrationEventMapper : Profile
    {
        public WritePatchIntegrationEventMapper() : this("WritePatchIntegrationEventMapper")
        {

        }

        public WritePatchIntegrationEventMapper(string profileName) : base(profileName)
        {
            CreateMap<ChangePortQueueRequest, WritePatchIntegrationEvent>().ReverseMap();
        }
    }
}
