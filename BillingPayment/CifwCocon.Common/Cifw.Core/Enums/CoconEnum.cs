
using System.ComponentModel;

namespace Cifw.Core.Enums
{
    public class CoconEnum
    {
        public enum FiberEnum
        {
            FIBER_A = 1,
            FIBER_B = 2
        }

        public enum HuurderEnum
        {
            CAIW = 1,
            RF = 2
        }

        public enum ActionTypes
        {
            [Description("Plan Patch")]
            PP = 1,
            [Description("Plan DePatch")]
            PD = 2,
            [Description("Rollback Patch")]
            RP = 3,
            [Description("Rollback DePatch")]
            RD = 4,
            [Description("Patch")]
            P = 5,
            [Description("DePatch")]
            D = 6
        }

        public enum FixedStatus
        {
            [Description("NOT PAID")] N = 1,
            [Description("PAID")] R = 2,
            [Description("PAID")] M = 3
        }

        public enum PartyType
        {
            Huurder = 1,
            Beheerder = 2
        }

        public enum RabbitFailureAction
        {
            Retry = 1,
            NoRetry = 2
        }
    }
}
