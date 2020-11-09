using System;
using System.ComponentModel.DataAnnotations;

namespace CifwCocon.NetworkInformation.Bo
{
    public class ChangePortQueueRequest
    {
        [Required]
        public int OrderId { get; set; }
        [Required]
        public int ActionTypeId { get; set; }
        public string ExternalId { get; set; }
        [Required]
        public string Postcode { get; set; }
        [Required]
        public int HouseNr { get; set; }
        public string HouseExt { get; set; }
        public string Room { get; set; }
        public int Fiber { get; set; }
        public string DevicePort { get; set; }
        public string OrderType { get; set; }
        [Required]
        public DateTime OrderDate { get; set; }
        public string ActiveOperator { get; set; } = "";
        public string RequestUser { get; set; }
    }
}
