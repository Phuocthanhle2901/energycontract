using System;

namespace CifwCocon.NetworkInformation.Bo
{
    public class FtthAdress
    {
        public string ZipCode { get; set; }

        public int HouseNumber { get; set; }

        public string HouseNumberExtension { get; set; }

        public string Room { get; set; }

        public int Fiber { get; set; }

        public string DevicePort { get; set; }

        public string OrderType { get; set; }

        public string OrderId { get; set; }

        public DateTime OrderDate { get; set; }

        public string ActiveOperator { get; set; }

        public string RequestUser { get; set; }
    }
}
