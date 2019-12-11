using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public class ProjectInternManager
    {
        public string ProjectInternManagerID { get; set; }
        public string StudentID { get; set; }
        public string ManagerID { get; set; }
        public string ProjectInternID { get; set; }
        public string InternshipID { get; set; }
        public bool IsPass { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime LastUpdated { get; set; }
        [NotMapped]
        public List<ProjectIntern> ProjectInternCollection { get; set; }
        [NotMapped]
        public List<Manager> ManagerCollection { get; set; }
        [NotMapped]
        public List<Student> StudentCollection { get; set; }
        [NotMapped]
        public List<Internship> InternshipCollection { get; set; }

        public virtual ProjectIntern ProjectIntern { get; set; }
        public virtual Internship Internship { get; set; }
        public virtual Manager Manager { get; set; }
        public virtual Student Student { get; set; }
    }
}
