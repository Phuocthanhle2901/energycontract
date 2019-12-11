using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public class Function
    {
        public int FunctionID { get; set; }
        public string FunctionName { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime LastUpdated { get; set; }

        public virtual ICollection<UserPermission> UserPermissions { get; set; }
    }
}
