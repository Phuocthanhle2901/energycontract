using Cifw.EventBus.Events;

namespace CifwCocon.NetworkInformation.Bo.Integration.Events
{
    public class UpdateLocalCacheByCleanIntegrationEvent : IntegrationEvent
    {
        public Address Address { get; set; }
        public FiberClean FiberA { get; set; }
        public FiberClean FiberB { get; set; }
    }
}
