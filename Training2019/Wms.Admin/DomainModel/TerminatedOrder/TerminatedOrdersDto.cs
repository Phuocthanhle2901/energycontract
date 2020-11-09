
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace DomainModel.TerminatedOrder
{
    public class TerminatedOrderResultDto
    {
        public List<TerminatedOrdersDto> Data { get; set; }
        public int TotalCount { get; set; }
    }

    public class TerminatedOrdersDto
    {
        [JsonProperty("externalId")]
        public string ExternalId { get; set; }

        [JsonProperty("wmsId")]
        public string WmsId { get; set; }

        [JsonProperty("address")]
        public string Address { get; set; }

        [JsonProperty("networkType")]
        public string NetworkType { get; set; }

        [JsonProperty("fiberCode")]
        public string FiberCode { get; set; }

        [JsonProperty("huurder")]
        public string Huurder { get; set; }

        [JsonProperty("beheerder")]
        public string Beheerder { get; set; }

        [JsonProperty("createTime")]
        public DateTime CreateTime { get; set; }

        [JsonProperty("lastUpdateTime")]
        public DateTime? LastUpdateTime { get; set; }
    }
}
