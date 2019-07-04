using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public class ProjectManagerDTO
    {
        [Key]
        public string ProjectManagerID { get; set; }
        public string ManagerID { get; set; }
        public string ProjectID { get; set; }
        public string StudentID { get; set; }
        public bool IsPass { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}
