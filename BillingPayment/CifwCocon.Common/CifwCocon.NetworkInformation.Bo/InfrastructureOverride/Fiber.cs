using System.Collections.Generic;

namespace CifwCocon.NetworkInformation.Bo.InfrastructureOverride
{
    public class Fiber
    {
        public string LocationName { get; set; }
        public string PopShelf { get; set; }
        public string Row { get; set; }
        public string Position { get; set; }
        public string Port { get; set; }
        public string Frame { get; set; }
        public string ActiveOperator { get; set; }
        public string FiberType { get; set; }
        public string PatchStatus { get; set; }
        public string ActiveOperatorOrderId { get; set; }
        public string ActiveOrderTypePlanned { get; set; }
        public string ActiveOperatorPlanned { get; set; }
        public string ActiveOperatorOrderIdPlanned { get; set; }
        public List<Party> Huurders { get; set; }
        public List<Party> Beheerders { get; set; }
    }
}
