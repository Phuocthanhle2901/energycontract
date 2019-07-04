namespace Repository.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Function",
                c => new
                    {
                        FunctionID = c.Int(nullable: false, identity: true),
                        FunctionName = c.String(),
                        DateCreated = c.DateTime(nullable: false),
                        LastUpdated = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.FunctionID);
            
            CreateTable(
                "dbo.Login",
                c => new
                    {
                        LoginID = c.Int(nullable: false, identity: true),
                        Username = c.String(),
                        Password = c.String(),
                        RoleID = c.Int(nullable: false),
                        FunctionID = c.Int(nullable: false),
                        DateCreated = c.DateTime(nullable: false),
                        LastUpdated = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.LoginID)
                .ForeignKey("dbo.Function", t => t.FunctionID, cascadeDelete: true)
                .ForeignKey("dbo.Role", t => t.RoleID, cascadeDelete: true)
                .Index(t => t.RoleID)
                .Index(t => t.FunctionID);
            
            CreateTable(
                "dbo.Role",
                c => new
                    {
                        RoleID = c.Int(nullable: false, identity: true),
                        RoleName = c.String(),
                        DateCreated = c.DateTime(nullable: false),
                        LastUpdated = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.RoleID);
            
            CreateTable(
                "dbo.Internship",
                c => new
                    {
                        InternshipID = c.String(nullable: false, maxLength: 128),
                        InternshipName = c.String(),
                        StartDate = c.DateTime(nullable: false),
                        EndDate = c.DateTime(nullable: false),
                        DateCreated = c.DateTime(nullable: false),
                        LastUpdated = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.InternshipID);
            
            CreateTable(
                "dbo.ProjectInternManager",
                c => new
                    {
                        ProjectInternManagerID = c.String(nullable: false, maxLength: 128),
                        StudentID = c.String(maxLength: 128),
                        ManagerID = c.String(maxLength: 128),
                        ProjectInternID = c.String(maxLength: 128),
                        InternshipID = c.String(maxLength: 128),
                        DateCreated = c.DateTime(nullable: false),
                        LastUpdated = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ProjectInternManagerID)
                .ForeignKey("dbo.Internship", t => t.InternshipID)
                .ForeignKey("dbo.Manager", t => t.ManagerID)
                .ForeignKey("dbo.Student", t => t.StudentID)
                .ForeignKey("dbo.ProjectIntern", t => t.ProjectInternID)
                .Index(t => t.StudentID)
                .Index(t => t.ManagerID)
                .Index(t => t.ProjectInternID)
                .Index(t => t.InternshipID);
            
            CreateTable(
                "dbo.Manager",
                c => new
                    {
                        ManagerID = c.String(nullable: false, maxLength: 128),
                        Name = c.String(),
                        Email = c.String(),
                        PhoneNumber = c.String(),
                        DateCreated = c.DateTime(nullable: false),
                        LastUpdated = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ManagerID);
            
            CreateTable(
                "dbo.ProjectManager",
                c => new
                    {
                        ProjectManagerID = c.String(nullable: false, maxLength: 128),
                        ManagerID = c.String(maxLength: 128),
                        ProjectID = c.String(maxLength: 128),
                        StudentID = c.String(maxLength: 128),
                        DateCreated = c.DateTime(nullable: false),
                        LastUpdated = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ProjectManagerID)
                .ForeignKey("dbo.Manager", t => t.ManagerID)
                .ForeignKey("dbo.Project", t => t.ProjectID)
                .ForeignKey("dbo.Student", t => t.StudentID)
                .Index(t => t.ManagerID)
                .Index(t => t.ProjectID)
                .Index(t => t.StudentID);
            
            CreateTable(
                "dbo.Project",
                c => new
                    {
                        ProjectID = c.String(nullable: false, maxLength: 128),
                        ProjectName = c.String(),
                        ProjectContent = c.String(),
                        DateCreated = c.DateTime(nullable: false),
                        LastUpdated = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ProjectID);
            
            CreateTable(
                "dbo.Student",
                c => new
                    {
                        StudentID = c.String(nullable: false, maxLength: 128),
                        Name = c.String(),
                        Birthday = c.DateTime(nullable: false),
                        Email = c.String(),
                        Address = c.String(),
                        PhoneNumber = c.String(),
                        Unit = c.String(),
                        Info = c.String(),
                        DateCreated = c.DateTime(nullable: false),
                        LastUpdated = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.StudentID);
            
            CreateTable(
                "dbo.TrainingManager",
                c => new
                    {
                        TrainingManagerID = c.String(nullable: false, maxLength: 128),
                        InternshipID = c.String(maxLength: 128),
                        ManagerID = c.String(maxLength: 128),
                        StudentID = c.String(maxLength: 128),
                        StageID = c.String(maxLength: 128),
                        TrainingProgramID = c.String(maxLength: 128),
                        AssertmentContent = c.String(),
                        Pass = c.Boolean(nullable: false),
                        DateCreated = c.DateTime(nullable: false),
                        LastUpdated = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.TrainingManagerID)
                .ForeignKey("dbo.Internship", t => t.InternshipID)
                .ForeignKey("dbo.Manager", t => t.ManagerID)
                .ForeignKey("dbo.Stage", t => t.StageID)
                .ForeignKey("dbo.Student", t => t.StudentID)
                .ForeignKey("dbo.TrainingProgram", t => t.TrainingProgramID)
                .Index(t => t.InternshipID)
                .Index(t => t.ManagerID)
                .Index(t => t.StudentID)
                .Index(t => t.StageID)
                .Index(t => t.TrainingProgramID);
            
            CreateTable(
                "dbo.Stage",
                c => new
                    {
                        StageID = c.String(nullable: false, maxLength: 128),
                        StageContent = c.String(),
                        DateCreated = c.DateTime(),
                        LastUpdated = c.DateTime(),
                    })
                .PrimaryKey(t => t.StageID);
            
            CreateTable(
                "dbo.TrainingProgram",
                c => new
                    {
                        TrainingProgramID = c.String(nullable: false, maxLength: 128),
                        TrainingContent = c.String(),
                        SpecializeID = c.String(maxLength: 128),
                        StartDate = c.DateTime(nullable: false),
                        EndDate = c.DateTime(nullable: false),
                        DateCreated = c.DateTime(nullable: false),
                        LastUpdated = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.TrainingProgramID)
                .ForeignKey("dbo.Specialize", t => t.SpecializeID)
                .Index(t => t.SpecializeID);
            
            CreateTable(
                "dbo.Specialize",
                c => new
                    {
                        SpecializeID = c.String(nullable: false, maxLength: 128),
                        SpecializeName = c.String(),
                        SpecializeContent = c.String(),
                        DateCreated = c.DateTime(nullable: false),
                        LastUpdated = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.SpecializeID);
            
            CreateTable(
                "dbo.ProjectIntern",
                c => new
                    {
                        ProjectInternID = c.String(nullable: false, maxLength: 128),
                        ProjectInternName = c.String(),
                        ProjectInternContent = c.String(),
                        StartDate = c.DateTime(nullable: false),
                        EndDate = c.DateTime(nullable: false),
                        DateCreated = c.DateTime(nullable: false),
                        LastUpdated = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ProjectInternID);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.ProjectInternManager", "ProjectInternID", "dbo.ProjectIntern");
            DropForeignKey("dbo.TrainingManager", "TrainingProgramID", "dbo.TrainingProgram");
            DropForeignKey("dbo.TrainingProgram", "SpecializeID", "dbo.Specialize");
            DropForeignKey("dbo.TrainingManager", "StudentID", "dbo.Student");
            DropForeignKey("dbo.TrainingManager", "StageID", "dbo.Stage");
            DropForeignKey("dbo.TrainingManager", "ManagerID", "dbo.Manager");
            DropForeignKey("dbo.TrainingManager", "InternshipID", "dbo.Internship");
            DropForeignKey("dbo.ProjectManager", "StudentID", "dbo.Student");
            DropForeignKey("dbo.ProjectInternManager", "StudentID", "dbo.Student");
            DropForeignKey("dbo.ProjectManager", "ProjectID", "dbo.Project");
            DropForeignKey("dbo.ProjectManager", "ManagerID", "dbo.Manager");
            DropForeignKey("dbo.ProjectInternManager", "ManagerID", "dbo.Manager");
            DropForeignKey("dbo.ProjectInternManager", "InternshipID", "dbo.Internship");
            DropForeignKey("dbo.Login", "RoleID", "dbo.Role");
            DropForeignKey("dbo.Login", "FunctionID", "dbo.Function");
            DropIndex("dbo.TrainingProgram", new[] { "SpecializeID" });
            DropIndex("dbo.TrainingManager", new[] { "TrainingProgramID" });
            DropIndex("dbo.TrainingManager", new[] { "StageID" });
            DropIndex("dbo.TrainingManager", new[] { "StudentID" });
            DropIndex("dbo.TrainingManager", new[] { "ManagerID" });
            DropIndex("dbo.TrainingManager", new[] { "InternshipID" });
            DropIndex("dbo.ProjectManager", new[] { "StudentID" });
            DropIndex("dbo.ProjectManager", new[] { "ProjectID" });
            DropIndex("dbo.ProjectManager", new[] { "ManagerID" });
            DropIndex("dbo.ProjectInternManager", new[] { "InternshipID" });
            DropIndex("dbo.ProjectInternManager", new[] { "ProjectInternID" });
            DropIndex("dbo.ProjectInternManager", new[] { "ManagerID" });
            DropIndex("dbo.ProjectInternManager", new[] { "StudentID" });
            DropIndex("dbo.Login", new[] { "FunctionID" });
            DropIndex("dbo.Login", new[] { "RoleID" });
            DropTable("dbo.ProjectIntern");
            DropTable("dbo.Specialize");
            DropTable("dbo.TrainingProgram");
            DropTable("dbo.Stage");
            DropTable("dbo.TrainingManager");
            DropTable("dbo.Student");
            DropTable("dbo.Project");
            DropTable("dbo.ProjectManager");
            DropTable("dbo.Manager");
            DropTable("dbo.ProjectInternManager");
            DropTable("dbo.Internship");
            DropTable("dbo.Role");
            DropTable("dbo.Login");
            DropTable("dbo.Function");
        }
    }
}
