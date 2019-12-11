using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public class TrainingProgram
    {
        public string TrainingProgramID { get; set; }
        public string TrainingContent { get; set; }
        public string SpecializeID { get; set; }
        [NotMapped]
        public List<Specialize> SpecializeCollection { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime LastUpdated { get; set; }

        public virtual ICollection<TrainingManager> TrainingManagers { get; set; }
        public virtual Specialize Specialize { get; set; }
    }
}
