namespace CifwCocon.NetworkInformation.Bo
{
    public class FiberClean : Fiber
    {
        public bool IsCleanOk { get; set; }
        public string MessageClean { get; set; }
        public RoutingInfo Routing { get; set; }
    }
}
