using System;
using System.Collections.Generic;

namespace CifwCocon.Entities.Models
{
    public partial class CoconAddressParty
    {
        public CoconAddressParty()
        {
            CoconAddressFibersParties = new HashSet<CoconAddressFibersParties>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Area { get; set; }
        public int PartyTypeId { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? LastUpdated { get; set; }
        public int? lineCsv { get; set; }
        public PartyType PartyType { get; set; }
        public ICollection<CoconAddressFibersParties> CoconAddressFibersParties { get; set; }
    }
}
