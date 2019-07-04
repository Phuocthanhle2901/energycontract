using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public class Manager
    {
        public Manager()
        {
            ProjectManagers = new HashSet<ProjectManager>();
        }
        [Required]
        public string ManagerID { get; set; }
        [Required]
        public string Name { get; set; }        
        [EmailAddress]
        [Required]
        public string Email { get; set; }
        [Phone]
        [Required]
        public string PhoneNumber { get; set; }
        public bool IsSuperManager { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime LastUpdated { get; set; }

        public virtual ICollection<ProjectInternManager> ProjectInternManagers { get; set; }
        public virtual ICollection<TrainingManager> TrainingManagers { get; set; }
        public virtual ICollection<ProjectManager> ProjectManagers { get; set; }

    }
}
