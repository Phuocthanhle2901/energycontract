using AutoMapper;
using CifwCocon.Core.Constants;
using CifwCocon.Entities.Models;
using CifwCocon.NetworkInformation.Bo;
using CifwCocon.NetworkInformation.Bo.Routing;
using CoconService;
using System.Collections.Generic;
using System.Linq;

namespace CifwCocon.Ultility.Mapper
{
    public class RoutingMapper : Profile
    {
        public RoutingMapper() : this("RoutingMapper")
        {

        }

        public RoutingMapper(string profileName) : base(profileName)
        {
            #region From Override
            CreateMap<NetworkInformation.Bo.InfrastructureOverride.Fiber, RoutingFiber>()
            .ForMember(s => s.FiberType, opt => opt.Ignore())
            .AfterMap((src, dest) =>
            {
                dest.FiberType = src.FiberType == "FIBER_A" ? 1 : 2;
                dest.Routing = new RoutingInfo
                {
                    BeheerderAreas = new List<string>(),
                    Beheerders = new List<string>(),
                    HuurderAreas = new List<string>(),
                    Huurders = new List<string>(),
                };

                foreach (var beheerder in src.Beheerders)
                {
                    if (!string.IsNullOrWhiteSpace(beheerder.Area)) dest.Routing.BeheerderAreas.Add(beheerder.Area);
                    if (!string.IsNullOrWhiteSpace(beheerder.Name)) dest.Routing.Beheerders.Add(beheerder.Name);
                }

                foreach (var huurder in src.Huurders)
                {
                    if (!string.IsNullOrWhiteSpace(huurder.Area)) dest.Routing.HuurderAreas.Add(huurder.Area);
                    if (!string.IsNullOrWhiteSpace(huurder.Name)) dest.Routing.Huurders.Add(huurder.Name);
                }
            });
            #endregion

            #region From Cocon
            CreateMap<List<FieldValue>, RoutingFiber>().AfterMap((src, dest) =>
            {
                var aggr = dest.FiberType == (int)Core.Enums.CoconEnum.FiberEnum.FIBER_A ? "AGGR" : "AGGR2";
                var arrayProperties = src.ToArray();
                dest.Routing = new RoutingInfo
                {
                    Huurders = Helpers.GetAggrFieldValues(arrayProperties, string.Format("{0}." + CoconConstants.strFieldActiveOperators, aggr)),
                    Beheerders = Helpers.GetAggrFieldValues(arrayProperties, string.Format("{0}." + CoconConstants.strFieldAdministrators, aggr)),
                    HuurderAreas = Helpers.GetAggrFieldValues(arrayProperties, string.Format("{0}." + CoconConstants.strFieldAreaActiveOperators, aggr)),
                    BeheerderAreas = Helpers.GetAggrFieldValues(arrayProperties, string.Format("{0}." + CoconConstants.strFieldAreaAdministrators, aggr)),
                };
            });
            #endregion

            #region From LocalCache
            CreateMap<CoconAddressFiber, RoutingFiber>().AfterMap((src, dest) =>
            {
                dest.FiberType = src.FiberType;
                dest.Routing = new RoutingInfo
                {
                    BeheerderAreas = new List<string>(),
                    Beheerders = new List<string>(),
                    HuurderAreas = new List<string>(),
                    Huurders = new List<string>(),
                };

                foreach (var mappingItems in src.CoconAddressFibersParties)
                {
                    if (mappingItems.Party == null) continue;
                    switch (mappingItems.Party.PartyTypeId)
                    {
                        case (int)Core.Enums.CoconEnum.PartyType.Huurder:
                            {
                                var party = mappingItems.Party;
                                if (!string.IsNullOrWhiteSpace(party.Area)) dest.Routing.HuurderAreas.Add(party.Area);
                                if (!string.IsNullOrWhiteSpace(party.Name)) dest.Routing.Huurders.Add(party.Name);
                                continue;
                            }
                        case (int)Core.Enums.CoconEnum.PartyType.Beheerder:
                            {
                                var party = mappingItems.Party;
                                if (!string.IsNullOrWhiteSpace(party.Area)) dest.Routing.BeheerderAreas.Add(party.Area);
                                if (!string.IsNullOrWhiteSpace(party.Name)) dest.Routing.Beheerders.Add(party.Name);
                                continue;
                            }
                        default:
                            continue;
                    }
                }
            });
            #endregion
        }
    }
}
