using Cifw.EventBus.Events;
using System;

namespace CifwCocon.NetworkInformation.Bo.IntegrationEvents.Events
{
    public class UpdateLocalCacheByPatchIntegrationEvent : IntegrationEvent
    {
        public int OrderId { get; set; }
        public int ActionTypeId { get; set; }
        public string ExternalId { get; set; }
        public string Postcode { get; set; }
        public int HouseNr { get; set; }
        public string HouseExt { get; set; }
        public string Room { get; set; }
        public int Fiber { get; set; }
        public string DevicePort { get; set; }
        public string OrderType { get; set; }
        public string ActiveOperator { get; set; }
        public DateTime OrderDate { get; set; }
        public string RequestUser { get; set; }
        public FiberClean FiberAData { get; set; }
        public FiberClean FiberBData { get; set; }
    }
}
