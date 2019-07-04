using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Repository.Models
{
    public class Login
    {
        [Key]
        public string Username { get; set; }
        public string Password { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime LastUpdated { get; set; }
        public string ResetPasswordCode { get; set; }
        public string Email { get; set; }
        public int RoleID { get; set; }
        

        public virtual ICollection<UserPermission> User_Permissions { get; set; }
        public virtual Role Role { get; set; }
    }
}
