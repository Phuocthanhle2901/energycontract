using System;
using System.Collections.Generic;

namespace CifwCocon.Entities.Models
{
    public partial class CoconAddressFibersParties
    {
        public int Id { get; set; }
        public int AddressId { get; set; }
        public int? FiberId { get; set; }
        public int? PartyId { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? LastUpdated { get; set; }

        public CoconAddress Address { get; set; }
        public CoconAddressFiber Fiber { get; set; }
        public CoconAddressParty Party { get; set; }
    }
}
