using System;

namespace DomainModel
{
    public class ResponseOrder
    {
        public string WmsId { get; set; }
        public string ExternalOrderUid { get; set; }
        public string Status { get; set; }
        public string OrderType { get; set; }
        public string StartDate { get; set; }
        public string HeaderId { get; set; }
        public string HeaderSystemId { get; set; }
    }
}
