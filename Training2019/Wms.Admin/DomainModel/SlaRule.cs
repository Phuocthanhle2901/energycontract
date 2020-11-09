using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using static DomainModel.Enum.OrderSlaEnum;

namespace DomainModel
{
    public class SlaRule
    {
        public int Id { get; set; }

        public string Organization { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public SlaDirection? SLAType { get; set; }

        public string Action { get; set; }

        public string SLA { get; set; }

        public int SLARuleNr { get; set; }

        public string ConstructionStatus { get; set; }

        public string ConnectionStatus { get; set; }

        public string NLType { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public Priority? Priority { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public RuleType? RuleType { get; set; }

        public int Threshold { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public MeasurementUnit? MeasurementUnit { get; set; }

        public DateTime? Start { get; set; }

        public DateTime? End { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public CalendarType Calendar { get; set; }

        public int DoMail { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public NetworkType? NetworkType { get; set; }

        public int RTD { get; set; }
    }
}
