using AutoMapper;
using Cifw.Core.Constants;
using CifwCocon.NetworkInformation.Bo;
using CifwCocon.Utility;
using CoconService;
using System;
using System.Collections.Generic;

namespace Cifw.Mapper
{
    public class FiberCleanMapper : Profile
    {
        public FiberCleanMapper() : this("FiberMapper")
        {

        }

        public FiberCleanMapper(string profileName) : base(profileName)
        {
            CreateMap<List<FieldValue>, FiberClean>().AfterMap((src, dest) =>
            {
                var fiber = dest.FiberType == (int)Cifw.Core.Enums.CoconEnum.FiberEnum.FIBER_A ? "FTTHFIBER" : "FTTHFIBER2";
                var aggr = dest.FiberType == (int)Cifw.Core.Enums.CoconEnum.FiberEnum.FIBER_A ? "AGGR" : "AGGR2";
                var location = Helpers.GetProperty(src, string.Format("{0}.POP_LOCATION", fiber));  // PopName
                dest.PopShelf = Helpers.GetProperty(src, string.Format("{0}.POP_SHELF", fiber));
                dest.Closet = Helpers.GetProperty(src, string.Format("{0}.POP_FRAME", fiber));
                dest.Row = Helpers.GetProperty(src, string.Format("{0}.POP_ROW", fiber));
                dest.Position = Helpers.GetProperty(src, string.Format("{0}.POP_POSITION", fiber));
                dest.Frame = Helpers.GetProperty(src, string.Format("{0}.POP_FRAME", fiber));
                dest.LocationName = string.IsNullOrWhiteSpace(location) ? location : location.ToLower();
                dest.PatchStatus = string.Empty;
                dest.Port = Helpers.GetProperty(src, string.Format("{0}.ACTIVE_PORT", fiber));
                dest.ActiveOperator = Helpers.GetProperty(src, string.Format("{0}.ACTIVE_OPERATOR", fiber));
                dest.ActiveOrderTypePlanned = Helpers.GetProperty(src, string.Format("{0}.ACTIVE_ORDERTYPE_PLANNED", fiber));
                dest.ActiveOperatorPlanned = Helpers.GetProperty(src, string.Format("{0}.ACTIVE_OPERATOR_PLANNED", fiber));
                dest.ActiveOperatorOrderIdPlanned = Helpers.GetProperty(src, string.Format("{0}.ACTIVE_OPERATOR_ORDERID_PLANNED", fiber));
                dest.ActiveOperatorOrderId = Helpers.GetProperty(src, string.Format("{0}.ACTIVE_OPERATOR_ORDERID", fiber));

                var arrayProperties = src.ToArray();
                dest.Routing = new RoutingInfo
                {                   
                    Huurders = Helpers.GetAggrFieldValues(arrayProperties, string.Format("{0}." + CoconConstants.strFieldActiveOperators, aggr)),
                    Beheerders = Helpers.GetAggrFieldValues(arrayProperties, string.Format("{0}." + CoconConstants.strFieldAdministrators, aggr)),
                    HuurderAreas = Helpers.GetAggrFieldValues(arrayProperties, string.Format("{0}." + CoconConstants.strFieldAreaActiveOperators, aggr)),
                    BeheerderAreas = Helpers.GetAggrFieldValues(arrayProperties, string.Format("{0}." + CoconConstants.strFieldAreaAdministrators, aggr)),
                };
            });
        }
    }
}
