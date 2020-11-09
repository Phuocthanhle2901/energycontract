using System.Collections.Generic;
using CifwCocon.ImportRepo.Base;

namespace CifwCocon.ImportRepo.Entities
{
    public class CoconAddressFiber : Entity
    {
        public string LocationName { get; set; }
        public string PopShelf { get; set; }
        public string Closet { get; set; }
        public string Row { get; set; }
        public string Position { get; set; }
        public string Port { get; set; }
        public string Frame { get; set; }
        public string ActiveOperator { get; set; }
        public byte FiberType { get; set; }
        public string PatchStatus { get; set; }
        public string ActiveOrderTypePlanned { get; set; }
        public string OrderType { get; set; }
        public string ActiveOperatorPlanned { get; set; }
        public string ActiveOperatorOrderIdPlanned { get; set; }
        public string ActiveOperatorOrderId { get; set; }
        public ICollection<CoconAddressFibersParties> CoconAddressFibersPartieses { get; set; }
    }
}
