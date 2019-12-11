using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public class TrainingManager
    {
        public string TrainingManagerID { get; set; }
        public string InternshipID { get; set; }
        public string ManagerID { get; set; }
        public string StudentID { get; set; }
        public string StageID { get; set; }
        public string TrainingProgramID { get; set; }
        public string AssertmentContent { get; set; }
        public bool IsPass { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime LastUpdated { get; set; }

        [NotMapped]
        public List<Stage> StageCollection { get; set; }
        [NotMapped]
        public List<Manager> ManagerCollection { get; set; }
        [NotMapped]
        public List<Student> StudentCollection { get; set; }
        [NotMapped]
        public List<Internship> InternshipCollection { get; set; }
        [NotMapped]
        public List<TrainingProgram> TrainingProgramCollection { get; set; }

        public virtual Stage Stage { get; set; }
        public virtual Internship Internship { get; set; }
        public virtual Manager Manager { get; set; }
        public virtual Student Student { get; set; }
        public virtual TrainingProgram TrainingProgram { get; set; }
    }
}
