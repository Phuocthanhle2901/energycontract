using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public class UserPermission
    {
        public int UserPermissionID { get; set; }
        [Required(ErrorMessage = "Required.")]
        public string Username { get; set; }
        [Required(ErrorMessage = "Required.")]
        public int FunctionID { get; set; }        
        public DateTime DateCreated { get; set; }
        public DateTime LastUpdated { get; set; }

        [NotMapped]
        public List<Login> LoginCollection { get; set; }
        [NotMapped]
        public List<Function> FunctionCollection { get; set; }

        public virtual Login Login { get; set; }
        public virtual Function Function { get; set; }
    }
}
