using Newtonsoft.Json;
using System.Collections.Generic;

namespace DomainModel.CoaxDto
{
   public class ResponseRoutingOrder
    {
        [JsonProperty("total")]
        public int Total { get; set; }
        [JsonProperty("take")]
        public int Take { get; set; }
        [JsonProperty("skip")]
        public int Skip { get; set; }
        [JsonProperty("items")]
        public List<RoutingResult> Items { get; set; }
    }
}
