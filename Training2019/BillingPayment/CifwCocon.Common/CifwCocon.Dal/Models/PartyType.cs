using System;
using System.Collections.Generic;

namespace CifwCocon.Entities.Models
{
    public partial class PartyType
    {
        public PartyType()
        {
            CoconAddressParty = new HashSet<CoconAddressParty>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? LastUpdated { get; set; }

        public ICollection<CoconAddressParty> CoconAddressParty { get; set; }
    }
}
