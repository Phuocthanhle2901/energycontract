using System;
using System.ComponentModel.DataAnnotations;

namespace Repository.Models
{
    public class ManagerDTO
    {
        [Required]
        public string ManagerID { get; set; }
        [Required]
        public string Name { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        [Phone]
        public string PhoneNumber { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime LastUpdated { get; set; }
    }
}
