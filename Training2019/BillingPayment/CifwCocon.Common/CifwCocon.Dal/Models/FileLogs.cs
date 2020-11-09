using System;
using System.Collections.Generic;

namespace CifwCocon.Entities.Models
{
    public partial class FileLogs
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsImported { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? LastUpdated { get; set; }
    }
}
