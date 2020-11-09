using AutoMapper;
using DomainModel;
using DomainModel.CoaxDto;
using Entities.Sla;
using System;
using static DomainModel.Enum.OrderSlaEnum;

namespace Wms.Admin.Core.Mapping
{
    public class SlaModelMapping : Profile
    {
        public SlaModelMapping()
        {
            CreateMap<SlaRule, Rule>()
             .ForMember(t => t.Id, opt => opt.Ignore())
             .AfterMap(
                (src, dest) =>
                {
                    dest.SlaDirection = src.SLAType ?? SlaDirection.huurder_wms;
                    dest.Calendar = (int)src.Calendar;
                    dest.Rule_nr = src.SLARuleNr;
                    dest.RuleName = src.SLA;
                    dest.CreatedDate = DateTime.Now;
                    dest.UpdatedDate = DateTime.Now;

                });
            CreateMap<Rule, SlaRule>()
            .AfterMap(
               (src, dest) =>
               {
                   dest.SLAType = src.SlaDirection;
                   dest.Calendar = (CalendarType)(src.Calendar);
                   dest.SLARuleNr = src.Rule_nr;
                   dest.SLA = src.RuleName;
                   dest.MeasurementUnit = src.MeasureUnit;
               });
        }
    }
}
