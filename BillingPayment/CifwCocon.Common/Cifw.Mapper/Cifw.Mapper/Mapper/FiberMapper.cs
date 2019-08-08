using AutoMapper;
using CifwCocon.NetworkInformation.Bo;
using CifwCocon.Utility;
using CoconService;
using System;
using System.Collections.Generic;

namespace Cifw.Mapper
{
    public class FiberMapper : Profile
    {
        public FiberMapper() : this("FiberMapper")
        {

        }

        public FiberMapper(string profileName) : base(profileName)
        {
            CreateMap<List<FieldValue>, Fiber>().AfterMap((src, dest) =>
            {
                var fiber = dest.FiberType == (int)Cifw.Core.Enums.CoconEnum.FiberEnum.FIBER_A ? "FTTHFIBER" : "FTTHFIBER2";
                var aggr = dest.FiberType == (int)Cifw.Core.Enums.CoconEnum.FiberEnum.FIBER_A ? "AGGR" : "AGGR2";
                var location = Helpers.GetProperty(src, string.Format("{0}.POP_LOCATION", fiber));  // PopName              
                dest.LocationName = string.IsNullOrWhiteSpace(location) ? location : location.ToLower();
                dest.PopShelf = Helpers.GetProperty(src, string.Format("{0}.POP_SHELF", fiber));
                dest.Closet = Helpers.GetProperty(src, string.Format("{0}.POP_FRAME", fiber));
                dest.Row = Helpers.GetProperty(src, string.Format("{0}.POP_ROW", fiber));
                dest.Position = Helpers.GetProperty(src, string.Format("{0}.POP_POSITION", fiber));
                dest.Frame = Helpers.GetProperty(src, string.Format("{0}.POP_FRAME", fiber));
                dest.PatchStatus = string.Empty;
                dest.Port = Helpers.GetProperty(src, string.Format("{0}.ACTIVE_PORT", fiber));
                dest.ActiveOperator = Helpers.GetProperty(src, string.Format("{0}.ACTIVE_OPERATOR", fiber));
                dest.ActiveOrderTypePlanned = Helpers.GetProperty(src, string.Format("{0}.ACTIVE_ORDERTYPE_PLANNED", fiber));
                dest.ActiveOperatorPlanned = Helpers.GetProperty(src, string.Format("{0}.ACTIVE_OPERATOR_PLANNED", fiber));
                dest.ActiveOperatorOrderIdPlanned = Helpers.GetProperty(src, string.Format("{0}.ACTIVE_OPERATOR_ORDERID_PLANNED", fiber));
                dest.ActiveOperatorOrderId = Helpers.GetProperty(src, string.Format("{0}.ACTIVE_OPERATOR_ORDERID", fiber));
            });
        }
    }
}
