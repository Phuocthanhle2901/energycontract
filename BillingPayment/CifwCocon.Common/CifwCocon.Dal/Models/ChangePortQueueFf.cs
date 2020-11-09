using System;
using System.Collections.Generic;

namespace CifwCocon.Entities.Models
{
    public partial class ChangePortQueueFf
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string ExternalId { get; set; }
        public string ZipCode { get; set; }
        public int HouseNumber { get; set; }
        public string HouseNumberExtension { get; set; }
        public string Room { get; set; }
        public int? Fiber { get; set; }
        public string DevicePort { get; set; }
        public string OrderType { get; set; }
        public DateTime OrderDate { get; set; }
        public string RequestUser { get; set; }
        public bool IsSuccessful { get; set; }
        public DateTime? SentDate { get; set; }
        public bool IsSendMail { get; set; }
        public int? CountRetry { get; set; }
    }
}
