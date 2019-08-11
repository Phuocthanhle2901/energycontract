using Newtonsoft.Json;
using System.Collections.Generic;

namespace DomainModel.CoconMapping
{
    public class CoconMappingData
    {
        [JsonProperty("id")]
        public int Id { get; set; }
        [JsonProperty("coconName")]
        public string CoconName { get; set; }
        [JsonProperty("wmsName")]
        public string WmsName { get; set; }
        [JsonProperty("wmsSystemName")]
        public string WmsSystemName { get; set; }
    }
    public class CoconMappingResult
    {
        public List<CoconMappingData> listItem { get; set; }
        public int pageSize { get; set; }
        public int totalItem { get; set; }
        public int totalPage { get; set; }
    }
}
