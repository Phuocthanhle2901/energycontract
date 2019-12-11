using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public class Specialize
    {
        public string SpecializeID { get; set; }
        public string SpecializeName { get; set; }
        public string SpecializeContent { get; set; }
        public int MinimumToPass { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime LastUpdated { get; set; }

        public virtual ICollection<TrainingProgram> TrainingPrograms { get; set; }
        public virtual ICollection<StudentCV> StudentCVs { get; set; }
    }
}
