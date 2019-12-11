using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public class ProjectManager
    {
        public string ProjectManagerID { get; set; }
        public string ManagerID { get; set; }
        public string ProjectID { get; set; }
        public string StudentID { get; set; }
        public bool IsPass { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime LastUpdated { get; set; }

        [NotMapped]
        public List<Project> ProjectCollection { get; set; }
        [NotMapped]
        public List<Manager> ManagerCollection { get; set; }
        [NotMapped]
        public List<Student> StudentCollection { get; set; }

        public virtual Project Project { get; set; }
        public virtual Manager Manager { get; set; }
        public virtual Student Student { get; set; }
    }
}
