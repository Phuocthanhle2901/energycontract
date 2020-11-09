using System.Collections.Generic;
using CifwCocon.ImportRepo.Base;

namespace CifwCocon.ImportRepo.Entities
{
    public class CoconAddressParty : Entity
    {
        public string Name { get; set; }
        public string Area { get; set; }
        public int PartyTypeId { get; set; }
        public PartyType PartyType { get; set; }
        public ICollection<CoconAddressFibersParties> CoconAddressFibersPartieses { get; set; }

    }
}
