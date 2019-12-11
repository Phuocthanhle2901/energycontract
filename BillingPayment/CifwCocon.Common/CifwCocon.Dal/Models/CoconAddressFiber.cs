using System;
using System.Collections.Generic;

namespace CifwCocon.Entities.Models
{
    public partial class CoconAddressFiber
    {
        public CoconAddressFiber()
        {
            CoconAddressFibersParties = new HashSet<CoconAddressFibersParties>();
        }

        public int Id { get; set; }
        public string Closet { get; set; }
        public string Row { get; set; }
        public string Position { get; set; }
        public string Port { get; set; }
        public string Frame { get; set; }
        public string ActiveOperator { get; set; }
        public string PopShelf { get; set; }
        public string LocationName { get; set; }
        public byte FiberType { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? LastUpdated { get; set; }
        public string PatchStatus { get; set; }
        public string ActiveOrderTypePlanned { get; set; }
        public string ActiveOperatorPlanned { get; set; }
        public string ActiveOperatorOrderIdPlanned { get; set; }
        public string OrderType { get; set; }
        public string ActiveOperatorOrderId { get; set; }
        public int? lineCsv { get; set; }

        public ICollection<CoconAddressFibersParties> CoconAddressFibersParties { get; set; }
    }
}
