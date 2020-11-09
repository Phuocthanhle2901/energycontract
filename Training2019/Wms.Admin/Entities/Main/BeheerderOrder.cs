using System;
using static DomainModel.Enum.OrderSlaEnum;
using static EntitiesEnum.OrderContextConstants;

namespace Entities.Main
{
    public class BeheerderOrder
    {
        public int Id { get; set; }
        public long WmsId { get; set; }
        public string ExternalOrderUid { get; set; }
        public Status? Status { get; set; }
        public OrderType OrderType { get; set; }
        public DateTime StartDate { get; set; }
        public int ConnectionId { get; set; }
        public int? BeheerderId { get; set; }

        public Beheerder Beheerder { get; set; }
        public Connection Connection { get; set; }
    }
}
