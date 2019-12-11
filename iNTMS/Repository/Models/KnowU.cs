using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public partial class KnowU
    {        
        public KnowU()
        {
            StudentCVs = new HashSet<StudentCV>();
        }

        [Key]
        public int KnowUsID { get; set; }

        [StringLength(150)]
        public string KnowUsName { get; set; }
                
        public virtual ICollection<StudentCV> StudentCVs { get; set; }
    }
}