using System;
using System.Collections.Generic;
using System.Text;
using static EntitiesEnum.OrderContextConstants;

namespace Entities.Main
{
    public class HuurderOrder
    {

        public int Id { get; set; }
        public long WmsId { get; set; }
        public string ExternalOrderUid { get; set; }
        public int ConnectionId { get; set; }
        public int HuurderId { get; set; }
        public Status? Status { get; set; }
        public DateTime StartDate { get; set; }
        public int? LastHistoryId { get; set; }

        public HuurderOrderHistory LastHistory { get; set; }
        public Connection Connection { get; set; }
        public Huurder Huurder { get; set; }
    }
}
