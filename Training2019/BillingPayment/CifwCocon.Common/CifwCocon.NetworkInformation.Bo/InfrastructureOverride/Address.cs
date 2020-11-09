using System.Collections.Generic;

namespace CifwCocon.NetworkInformation.Bo.InfrastructureOverride
{
    public class Address
    {
        public string Zipcode { get; set; }
        public int HouseNumber { get; set; }
        public string HouseNumberExt { get; set; }
        public string Room { get; set; }
        public string Name { get; set; }
        public string ShortName { get; set; }
        public System.DateTime? HasBegin { get; set; }
        public string DeliveryClass { get; set; }
        public string ConnectionStatus { get; set; }
        public string CommentsOnDeliveryClass { get; set; }
        public string FtuType { get; set; }
        public string AreaCode { get; set; }
        public string MonthlyChangeCode { get; set; }
        public string SingleChangeCode { get; set; }
        public string RedemtionCode { get; set; }
        public string FixedChangeStatus { get; set; }
        public string AddressConnection { get; set; }
        public int? RelationId { get; set; }
        public string NameOfRelation { get; set; }
        public string Article { get; set; }
        public byte? StatusOfPayment { get; set; }
        public bool RemovedFromEol { get; set; }
        public bool ProvidedFromEol { get; set; }
        public List<Fiber> Fibers { get; set; }
        public string KeyUrl { get; set; }
        public string Frame { get; set; }
    }
}
