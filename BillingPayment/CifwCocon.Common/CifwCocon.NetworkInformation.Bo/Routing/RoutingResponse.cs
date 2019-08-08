using static Cifw.Core.Constants.CoconConstants;

namespace CifwCocon.NetworkInformation.Bo.Routing
{
    public class RoutingResponse
    {
        public string Zipcode { get; set; }
        public int HouseNumber { get; set; }
        public string HouseNumberExtension { get; set; }
        public string Room { get; set; }
        public RoutingFiber RoutingFiberA { get; set; }
        public RoutingFiber RoutingFiberB { get; set; }
        public FromNetwork From { get; set; }
    }
}
