using Newtonsoft.Json;

namespace DomainModel.CoaxDto
{
    public class Party
    {
        [JsonProperty("name")]
        public string Name => $"{HeaderId} | {HeaderName}";

        [JsonProperty("headerId")]
        public string HeaderId { get; set; }

        [JsonProperty("headerName")]
        public string HeaderName { get; set; }
    }
}
