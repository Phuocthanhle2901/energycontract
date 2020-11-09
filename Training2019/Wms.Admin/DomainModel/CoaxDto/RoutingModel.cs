using Newtonsoft.Json;

namespace DomainModel.CoaxDto
{
   public class RoutingModel
    {
        public int Id { get; set; }
        [JsonProperty("huurderName")]
        public string HuurderName { get; set; }

        [JsonProperty("huurderSystemName")]
        public string HuurderSystemName { get; set; }

        [JsonProperty("areaId")]
        public int? AreaId { get; set; }

        [JsonProperty("networkType")]
        public string NetworkType { get; set; }

        [JsonProperty("beheerderName")]
        public string BeheerderName { get; set; }

        [JsonProperty("beheerderSystemName")]
        public string BeheerderSystemName { get; set; }
        /// <summary>
        /// Area name
        /// </summary>
        [JsonProperty("areaName")]
        public string AreaName { get; set; }
    }
}
