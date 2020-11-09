using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace DomainModel.Enum
{
   public class RoutingEnum
    {
        public enum SearchDto
        {
            contractfrom,
            partyfrom,
            area,
            networktype,
            fibecode,
            networkowner,
            contractto,
            partyto,
            no
        }

        public enum FiberCode
        {
            [EnumMember(Value = "FIBER_A")]
            FIBER_A,
            [EnumMember(Value = "FIBER_B")]
            FIBER_B
        }


    }
}
