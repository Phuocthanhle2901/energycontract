using AutoMapper;

namespace Cifw.Mapper.WritePatch
{
    public class UpdateLocalCacheByPatchIntegrationEventMapper : Profile
    {
        public UpdateLocalCacheByPatchIntegrationEventMapper() : this("UpdateLocalCacheByPatchIntegrationEventMapper")
        {

        }

        public UpdateLocalCacheByPatchIntegrationEventMapper(string profileName) : base(profileName)
        {
            CreateMap<WritePatchIntegrationEventMapper, UpdateLocalCacheByPatchIntegrationEventMapper>().ReverseMap();
        }
    }
}
