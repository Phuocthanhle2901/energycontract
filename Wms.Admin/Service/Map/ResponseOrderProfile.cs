using System.Globalization;
using AutoMapper;
using DomainModel;
using Entities.Main;

namespace Service.Map
{
    public class ResponseOrderProfile : Profile
    {
        public ResponseOrderProfile()
        {
            CreateMap<HuurderOrder, ResponseOrder>().AfterMap((src, des) => {

                des.WmsId = src.WmsId.ToString();
                des.ExternalOrderUid = src.ExternalOrderUid;
                des.Status = src.Status.ToString();
                des.StartDate = src.StartDate.ToString(CultureInfo.InvariantCulture);
                des.HeaderId = src.Huurder.HeaderId;
                des.HeaderSystemId = src.Huurder.HeaderSystemId;
            });
        }
    }
}
