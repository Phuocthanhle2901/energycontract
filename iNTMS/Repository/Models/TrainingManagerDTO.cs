using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Models
{
    public class TrainingManagerDTO
    {
        [Key]
        public string TrainingManagerID { get; set; }
        public string InternshipID { get; set; }
        public string ManagerID { get; set; }
        public string StudentID { get; set; }
        public string StageID { get; set; }
        public string TrainingProgramID { get; set; }
        public string AssertmentContent { get; set; }
        public bool IsPass { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}
