using Newtonsoft.Json;

namespace CifwCocon.NetworkInformation.Bo
{
    public class ReadEntityResponseBo
    {
        public Address Address { get; set; }
        public Fiber FiberA { get; set; }
        public Fiber FiberB { get; set; }

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
