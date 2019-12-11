using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public class Stage
    {
        public string StageID { get; set; }
        public string StageContent { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? LastUpdated { get; set; }

        public virtual ICollection<TrainingManager> TrainingManagers { get; set; }
    }
}
