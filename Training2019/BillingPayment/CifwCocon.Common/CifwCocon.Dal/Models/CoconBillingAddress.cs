using System;
using System.Collections.Generic;

namespace CifwCocon.Entities.Models
{
    public partial class CoconBillingAddress
    {
        public int Id { get; set; }
        public string Zipcode { get; set; }
        public int? HouseNumber { get; set; }
        public string HousenumberExt { get; set; }
        public string Room { get; set; }
        public string FixedChangeStatus { get; set; }
        public string AddressConnection { get; set; }
        public int? RelationId { get; set; }
        public string NameOfRelation { get; set; }
        public string Article { get; set; }
        public byte? StatusOfPayment { get; set; }
        public string NoteAfterUpdateEntity { get; set; }
        public bool? UpdateEntitySuccess { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? LastUpdated { get; set; }
    }
}
