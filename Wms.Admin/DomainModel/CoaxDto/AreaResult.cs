using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace DomainModel.CoaxDto
{
   public class AreaResult

    {
        [JsonProperty("id")]
        public int Id { get; set; }
        [JsonProperty("area")]
        public string Area { get; set; }
        [JsonProperty("networkowner")]
        public string NetworkOwner { get; set; }
    }
}
