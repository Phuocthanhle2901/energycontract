using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Text;
using static DomainModel.Enum.OrderSlaEnum;

namespace DomainModel.DtoSlaRule
{
    public class BuidingStatus
    {
        public string Name { get; set; }
    }
    public class OrderTypeSla
    {
        public string Name { get; set; }
    }
    public class NlTypeSla
    {
        public string Name { get; set; }
    }
    public class MeasurementSla
    {
        public string Name { get; set; }
    }
    public class UnitSla
    {
        public string Name { get; set; }
    }
    public class CalendarSla
    {
        public string Name { get; set; }
    }
    public class NetworkTypeSla
    {
        public string Name { get; set; }
    }
    public class SlaType
    {
        public string Name { get; set; }
    }
    public class Priority
    {
        public string Name { get; set; }
    }

    public class OrganizationSla
    {
        public string Name { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public SlaDirection slaType { get; set; }
    }

    public class ConnectionStatusSla
    {
        public string Name { get; set; }
    }
    public class Availabilty
    {
        public string Name { get; set; }
    }

    public class SortRule
    {
       public string SortBy { get; set; }
       public string SortType { get; set; }
    }
}
