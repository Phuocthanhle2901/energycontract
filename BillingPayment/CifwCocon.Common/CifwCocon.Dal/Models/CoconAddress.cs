using System;
using System.Collections.Generic;

namespace CifwCocon.Entities.Models
{
    public partial class CoconAddress
    {
        public CoconAddress()
        {
            CoconAddressFibersParties = new HashSet<CoconAddressFibersParties>();
        }

        public int Id { get; set; }
        public string Zipcode { get; set; }
        public int HouseNumber { get; set; }
        public string HouseNumberExt { get; set; }
        public string Room { get; set; }
        public string DeliveryClass { get; set; }
        public string ConnectionStatus { get; set; }
        public string CommentsOnDeliveryClass { get; set; }
        public string FtuType { get; set; }
        public string AreaCode { get; set; }
        public string MonthlyChangeCode { get; set; }
        public string SingleChangeCode { get; set; }
        public string RedemtionCode { get; set; }
        public string FixedChangeStatus { get; set; }
        public string Name { get; set; }
        public string ShortName { get; set; }
        public DateTime? HasBegin { get; set; }
        public bool RemovedFromEol { get; set; }
        public bool ProvidedFromEol { get; set; }
        public string AddressConnection { get; set; }
        public int? RelationId { get; set; }
        public string NameOfRelation { get; set; }
        public string Article { get; set; }
        public byte? StatusOfPayment { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? LastUpdated { get; set; }
        public string AreaNumber { get; set; }
        public string ContractArea { get; set; }
        public bool? Purchased { get; set; }
        public int? lineCsv { get; set; }

        public ICollection<CoconAddressFibersParties> CoconAddressFibersParties { get; set; }
    }
}
