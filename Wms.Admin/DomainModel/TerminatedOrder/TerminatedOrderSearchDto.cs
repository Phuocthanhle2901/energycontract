using Newtonsoft.Json;

namespace DomainModel.TerminatedOrder
{
    public enum OrderType
    {
        Terminated,
        Deleted
    }

    public class TerminatedOrderSearchDto
    {
        [JsonProperty("index")]
        public int Index { get; set; }

        [JsonProperty("pageSize")]
        public int PageSize { get; set; }

        [JsonProperty("wmsId")]
        public string WmsId { get; set; }

        [JsonProperty("externalOrderUid")]
        public string ExternalId { get; set; }
     
        [JsonProperty("orderType")]
        public OrderType? OrderType { get; set; }
    }
}
