using Newtonsoft.Json;

namespace DomainModel.CoconMapping
{
    public class Party
    {
        [JsonProperty("headerId")]
        public string HeaderId { get; set; }

        [JsonProperty("headerName")]
        public string HeaderName { get; set; }
    }
}
