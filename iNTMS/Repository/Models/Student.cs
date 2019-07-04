using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public class Student
    {
        public Student()
        {
            ProjectManagers = new HashSet<ProjectManager>();
        }
        public string StudentID { get; set; }
        public string Name { get; set; }
        [Column(TypeName = "date")]
        [Display(Name = "Day of Birth")]        
        [DataType(DataType.Date)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd/MM/yyyy}")]
        public DateTime Birthday { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Unit { get; set; }
        public string Info { get; set; }
        public string ProgressID { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime LastUpdated { get; set; }
        public virtual Progress Progress { get; set; }
        [NotMapped]
        public List<Progress> ProgressCollection { get; set; }
        public virtual ICollection<ProjectManager> ProjectManagers { get; set; }
        public virtual ICollection<ProjectInternManager> ProjectInternManagers { get; set; }
        public virtual ICollection<TrainingManager> TrainingManagers { get; set; }
    }
}
