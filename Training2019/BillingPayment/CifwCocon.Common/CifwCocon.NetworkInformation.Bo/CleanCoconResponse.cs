using Newtonsoft.Json;
using static Cifw.Core.Constants.CoconConstants;

namespace CifwCocon.NetworkInformation.Bo
{
    public class CleanCoconResponse
    {
        public Address Address { get; set; }
        public FiberClean FiberA { get; set; }
        public FiberClean FiberB { get; set; }
        public FromNetwork FromNetwork { get; set; }
        public bool IsWarning { get; set; }
        public string WarningMessage { get; set; }

        [JsonIgnore]
        public bool IsNull
        {
            get
            {
                return
                   (FiberA == null && FiberB == null)
                   ||
                   (
                        FiberA != null && FiberA.IsNull &&
                        FiberB != null && FiberB.IsNull
                   );
            }
        }
    }
}
