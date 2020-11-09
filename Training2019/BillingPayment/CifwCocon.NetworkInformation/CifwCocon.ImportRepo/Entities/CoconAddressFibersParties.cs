using CifwCocon.ImportRepo.Base;

namespace CifwCocon.ImportRepo.Entities
{
    public class CoconAddressFibersParties : Entity
    {
        public int AddressId { get; set; }
        public CoconAddress CoconAddress { get; set; }
        public int? FiberId { get; set; }
        public CoconAddressFiber CoconAddressFiber { get; set; }
        public int? PartyId { get; set; }
        public CoconAddressParty CoconAddressParty { get; set; }
    }
}
