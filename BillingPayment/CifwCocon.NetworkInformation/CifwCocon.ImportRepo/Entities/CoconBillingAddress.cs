using CifwCocon.ImportRepo.Base;

namespace CifwCocon.ImportRepo.Entities
{
    public class CoconBillingAddress : Entity
    {
        public string Zipcode { get; set; }
        public int HouseNumber { get; set; }
        public string HousenumberExt { get; set; }
        public string Room { get; set; }
        public string FixedChangeStatus { get; set; }
        public string AddressConnection { get; set; }
        public int? RelationId { get; set; }
        public string NameOfRelation { get; set; }
        public string NoteAfterUpdateEntity { get; set; }
        public string Article { get; set; }
        public byte? StatusOfPayment { get; set; }
        public bool? UpdateEntitySuccess { get; set; }
    }
}
