using Repository.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.DAL
{
    public class InternContext : DbContext
    {        
        public InternContext() : base("IFD_InternsManagement_Team") { }

        public DbSet<Function> Functions { get; set; }
        public DbSet<Internship> Internships { get; set; }
        public DbSet<Login> Logins { get; set; }
        public DbSet<Manager> Managers { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectIntern> ProjectInterns { get; set; }
        public DbSet<ProjectInternManager> ProjectInternManagers { get; set; }
        public DbSet<ProjectManager> ProjectManagers { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Specialize> Specializes { get; set; }
        public DbSet<Stage> Stages { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<TrainingManager> TrainingManagers { get; set; }
        public DbSet<TrainingProgram> TrainingPrograms { get; set; }
        public DbSet<StudentCV> StudentCVs { get; set; }
        public DbSet<KnowU> KnowUs { get; set; }
        public DbSet<ExpectedLocation> ExpectedLocations { get; set; }
        public DbSet<UserPermission> UserPermissions { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<SuperManager> SuperManagers { get; set; }
        public DbSet<EmailTemplate> EmailTemplates { get; set; }
        public DbSet<Progress> Progresses { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}
