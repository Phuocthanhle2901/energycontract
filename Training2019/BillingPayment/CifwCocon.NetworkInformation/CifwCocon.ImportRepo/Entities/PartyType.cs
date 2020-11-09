using System.Collections.Generic;
using CifwCocon.ImportRepo.Base;

namespace CifwCocon.ImportRepo.Entities
{
    public class PartyType : Entity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<CoconAddressParty> CoconAddressParties { get; set; }
    }
}
