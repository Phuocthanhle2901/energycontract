using AutoMapper;
using CifwCocon.ImportBiz.Bo;
using CifwCocon.ImportRepo.Entities;

namespace CifwCocon.ImportBiz.MappingProfiles
{
    public class CoconAddressMappingProfile : Profile
    {
        public CoconAddressMappingProfile()
        {
            CreateMap<CoconAddressBo, CoconAddress>()
                .ForMember(f => f.Id, o => o.Ignore())
                .ForMember(f=>f.ProvidedFromEol, o => o.Ignore());
            CreateMap<CoconAddressBo, CoconBillingAddress>()
                .ForMember(f => f.Id, o => o.Ignore())
                .AfterMap((s, d) =>
                {
                    d.HousenumberExt = string.IsNullOrWhiteSpace(d.HousenumberExt) ? null : d.HousenumberExt;
                    d.UpdateEntitySuccess = null;
                });
        }
    }
}
