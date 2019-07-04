namespace Repository.Migrations
{
    using Repository.DAL;
    using Repository.Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<InternContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(InternContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data.
            context.Functions.AddOrUpdate(x => x.FunctionID,
                new Function()
                {
                    FunctionID = 1,
                    FunctionName = "Create Student",
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                },
                new Function()
                {
                    FunctionID = 2,
                    FunctionName = "Read Student",
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                },
                new Function()
                {
                    FunctionID = 3,
                    FunctionName = "Update Student",
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                },
                new Function()
                {
                    FunctionID = 4,
                    FunctionName = "Delete Student",
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                },
                new Function()
                {
                    FunctionID = 5,
                    FunctionName = "Full On Student",
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                },
                new Function()
                {
                    FunctionID = 6,
                    FunctionName = "Create Project",
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                },
                new Function()
                {
                    FunctionID = 7,
                    FunctionName = "Read Project",
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                },
                new Function()
                {
                    FunctionID = 8,
                    FunctionName = "Update Project",
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                },
                new Function()
                {
                    FunctionID = 9,
                    FunctionName = "Delete Project",
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                },
                new Function()
                {
                    FunctionID = 10,
                    FunctionName = "Full On Project",
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                },
                new Function()
                {
                    FunctionID = 11,
                    FunctionName = "Create Manager",
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                },
                new Function()
                {
                    FunctionID = 12,
                    FunctionName = "Read Manager",
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                },
                new Function()
                {
                    FunctionID = 13,
                    FunctionName = "Update Manager",
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                },
                new Function()
                {
                    FunctionID = 14,
                    FunctionName = "Delete Manager",
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                },
                new Function()
                {
                    FunctionID = 15,
                    FunctionName = "Full On Manager",
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                },
                new Function()
                {
                    FunctionID = 16,
                    FunctionName = "Full All Access",
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                });

            context.Roles.AddOrUpdate(x => x.RoleID,
                new Role()
                {
                    RoleID = 1,
                    RoleName = "Admin",
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                },
                new Role()
                {
                    RoleID = 2,
                    RoleName = "Manager",
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                },
                new Role()
                {
                    RoleID = 3,
                    RoleName = "Student",
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                });

            context.Logins.AddOrUpdate(
                new Login()
                {
                    Username = "admin",
                    Password = "1",
                    RoleID = 1,
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                });

            context.UserPermissions.AddOrUpdate(x => x.UserPermissionID,
                new UserPermission()
                {
                    UserPermissionID = 1,
                    Username = "admin",
                    FunctionID = 16,                    
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                }
                );
            context.Progresses.AddOrUpdate(x => x.ProgressID,
                new Progress()
                {
                    ProgressID = "PROGRESS_000",
                    ProgressContent = "New Interns",
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                },
                new Progress()
                {
                    ProgressID = "PROGRESS_001",
                    ProgressContent = "Passed Training",
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                },
                new Progress()
                {
                    ProgressID = "PROGRESS_002",
                    ProgressContent = "Passed Project Intern",
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                },
                new Progress()
                {
                    ProgressID = "PROGRESS_003",
                    ProgressContent = "Passed Project",
                    DateCreated = DateTime.Now,
                    LastUpdated = DateTime.Now
                }
                );
        }
    }
}
