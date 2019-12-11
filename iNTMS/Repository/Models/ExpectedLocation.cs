using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public partial class ExpectedLocation
    {
        public ExpectedLocation()
        {
            StudentCVs = new HashSet<StudentCV>();
        }

        public int ExpectedLocationID { get; set; }

        [StringLength(150)]
        public string ExpectedLocationName { get; set; }

        
        public virtual ICollection<StudentCV> StudentCVs { get; set; }
    }
}
