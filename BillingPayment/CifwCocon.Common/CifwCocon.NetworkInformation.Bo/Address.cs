using System;

namespace CifwCocon.NetworkInformation.Bo
{
    public class Address
    {
        public string Zipcode { get; set; }
        public int HouseNumber { get; set; }
        public string HouseNumberExtension { get; set; }
        public string Room { get; set; }
        public string DeliveryClass { get; set; }
        public string ConnenctionStatus { get; set; }
        public string Comments { get; set; }
        public string FtuType { get; set; }
        public Area Area { get; set; }
        public DateTime? HasDate { get; set; }
        public string Frame { get; set; }
    }
}
