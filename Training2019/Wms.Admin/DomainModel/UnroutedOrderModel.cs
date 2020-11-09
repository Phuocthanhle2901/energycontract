using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel
{
    public class UnroutedOrderModel
    {
        public string ExternalId { get; set; }
        public long CifId { get; set; }
        public string Address { get; set; }
        public string NetworkType { get; set; }
        public string FiberCode { get; set; }
        public string Source { get; set; }
        public string Destination { get; set; }
        public DateTime? CreationDate { get; set; }
        public string Note { get; set; }
       
    }

}

