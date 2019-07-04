using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public class Project
    {
        public Project()
        {
            ProjectManagers = new HashSet<ProjectManager>();
        }

        public string ProjectID { get; set; }
        public string ProjectName { get; set; }
        public string ProjectContent { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime LastUpdated { get; set; }

        public virtual ICollection<ProjectManager> ProjectManagers { get; set; }
    }
}
