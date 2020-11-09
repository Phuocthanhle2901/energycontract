using System;
using System.Collections.Generic;

namespace CifwCocon.Entities.Models
{
    public partial class Configuration
    {
        public string Key { get; set; }
        public string Value { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public string Environment { get; set; }
    }
}
