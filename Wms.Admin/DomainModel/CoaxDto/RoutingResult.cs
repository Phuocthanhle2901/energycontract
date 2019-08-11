using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel.CoaxDto
{
    public class RoutingResult
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("huurderName")]
        public string HuurderName { get; set; }

        [JsonProperty("huurderSystemName")]
        public string HuurderSystemName { get; set; }

        [JsonProperty("areaName")]
        public string Area { get; set; }

        [JsonProperty("areaId")]
        public int? AreaId { get; set; }

        [JsonProperty("fibecode")]
        public string FiberCode { get; set; }

        [JsonProperty("beheerderName")]
        public string BeheerderName { get; set; }

        [JsonProperty("beheerderSystemName")]
        public string BeheerderSystemName { get; set; }
    }
}
