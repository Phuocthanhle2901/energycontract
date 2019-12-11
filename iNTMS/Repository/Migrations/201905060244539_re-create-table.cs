namespace Repository.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class recreatetable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.ExpectedLocation",
                c => new
                    {
                        ExpectedLocationID = c.Int(nullable: false, identity: true),
                        ExpectedLocationName = c.String(maxLength: 150),
                    })
                .PrimaryKey(t => t.ExpectedLocationID);
            
            CreateTable(
                "dbo.StudentCV",
                c => new
                    {
                        ID = c.Int(nullable: false, identity: true),
                        StudentID = c.String(nullable: false, maxLength: 15),
                        StudentName = c.String(nullable: false, maxLength: 100),
                        Email = c.String(nullable: false, maxLength: 254),
                        KnowUsID = c.Int(nullable: false),
                        FrameworkUse = c.String(nullable: false, maxLength: 50),
                        Problem = c.String(nullable: false),
                        ExAppAlone = c.String(nullable: false),
                        SpecializeID = c.String(nullable: false, maxLength: 128),
                        Intro = c.String(nullable: false),
                        ExpectedLocationID = c.Int(nullable: false),
                        InternStartDate = c.DateTime(nullable: false, storeType: "date"),
                        ExAppTeam = c.String(nullable: false),
                        Status = c.Boolean(nullable: false),
                        InterviewSchedule = c.DateTime(nullable: false),
                        Gender = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.ID)
                .ForeignKey("dbo.ExpectedLocation", t => t.ExpectedLocationID, cascadeDelete: true)
                .ForeignKey("dbo.KnowU", t => t.KnowUsID, cascadeDelete: true)
                .ForeignKey("dbo.Specialize", t => t.SpecializeID, cascadeDelete: true)
                .Index(t => t.KnowUsID)
                .Index(t => t.SpecializeID)
                .Index(t => t.ExpectedLocationID);
            
            CreateTable(
                "dbo.KnowU",
                c => new
                    {
                        KnowUsID = c.Int(nullable: false, identity: true),
                        KnowUsName = c.String(maxLength: 150),
                    })
                .PrimaryKey(t => t.KnowUsID);
            
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
                "dbo.TrainingProgram",
                c => new
                    {
                        TrainingProgramID = c.String(nullable: false, maxLength: 128),
                        TrainingContent = c.String(),
                        SpecializeID = c.String(maxLength: 128),
                        StartDate = c.DateTime(nullable: false),
                        EndDate = c.DateTime(nullable: false),
                        IsPass = c.Boolean(nullable: false),
                        DateCreated = c.DateTime(nullable: false),
                        LastUpdated = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.TrainingProgramID)
                .ForeignKey("dbo.Specialize", t => t.SpecializeID)
                .Index(t => t.SpecializeID);
            
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
                .ForeignKey("dbo.Student", t => t.StudentID)
                .ForeignKey("dbo.Manager", t => t.ManagerID)
                .ForeignKey("dbo.Internship", t => t.InternshipID)
                .ForeignKey("dbo.Stage", t => t.StageID)
                .ForeignKey("dbo.TrainingProgram", t => t.TrainingProgramID)
                .Index(t => t.InternshipID)
                .Index(t => t.ManagerID)
                .Index(t => t.StudentID)
                .Index(t => t.StageID)
                .Index(t => t.TrainingProgramID);
            
            CreateTable(
                "dbo.Internship",
                c => new
                    {
                        InternshipID = c.String(nullable: false, maxLength: 128),
                        InternshipName = c.String(),
                        StartDate = c.DateTime(nullable: false, storeType: "date"),
                        EndDate = c.DateTime(nullable: false, storeType: "date"),
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
                        Name = c.String(nullable: false),
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
                        IsPass = c.Boolean(nullable: false),
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
                        Gender = c.String(),
                        Address = c.String(),
                        PhoneNumber = c.String(),
                        Unit = c.String(),
                        Info = c.String(),
                        IsPassTraining = c.Boolean(nullable: false),
                        IsPassProjectIntern = c.Boolean(nullable: false),
                        IsPassProject = c.Boolean(nullable: false),
                        DateCreated = c.DateTime(nullable: false),
                        LastUpdated = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.StudentID);
            
            CreateTable(
                "dbo.ProjectIntern",
                c => new
                    {
                        ProjectInternID = c.String(nullable: false, maxLength: 128),
                        ProjectInternName = c.String(),
                        ProjectInternContent = c.String(),
                        IsPass = c.Boolean(nullable: false),
                        StartDate = c.DateTime(nullable: false, storeType: "date"),
                        EndDate = c.DateTime(nullable: false, storeType: "date"),
                        DateCreated = c.DateTime(nullable: false),
                        LastUpdated = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ProjectInternID);
            
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
                "dbo.UserPermission",
                c => new
                    {
                        UserPermissionID = c.Int(nullable: false, identity: true),
                        Username = c.String(nullable: false, maxLength: 128),
                        FunctionID = c.Int(nullable: false),
                        DateCreated = c.DateTime(nullable: false),
                        LastUpdated = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.UserPermissionID)
                .ForeignKey("dbo.Function", t => t.FunctionID, cascadeDelete: true)
                .ForeignKey("dbo.Login", t => t.Username, cascadeDelete: true)
                .Index(t => t.Username)
                .Index(t => t.FunctionID);
            
            CreateTable(
                "dbo.Login",
                c => new
                    {
                        Username = c.String(nullable: false, maxLength: 128),
                        Password = c.String(),
                        DateCreated = c.DateTime(nullable: false),
                        LastUpdated = c.DateTime(nullable: false),
                        ResetPasswordCode = c.String(),
                        Email = c.String(),
                        RoleID = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Username)
                .ForeignKey("dbo.Role", t => t.RoleID, cascadeDelete: true)
                .Index(t => t.RoleID);
            
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
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UserPermission", "Username", "dbo.Login");
            DropForeignKey("dbo.Login", "RoleID", "dbo.Role");
            DropForeignKey("dbo.UserPermission", "FunctionID", "dbo.Function");
            DropForeignKey("dbo.TrainingManager", "TrainingProgramID", "dbo.TrainingProgram");
            DropForeignKey("dbo.TrainingManager", "StageID", "dbo.Stage");
            DropForeignKey("dbo.TrainingManager", "InternshipID", "dbo.Internship");
            DropForeignKey("dbo.ProjectInternManager", "ProjectInternID", "dbo.ProjectIntern");
            DropForeignKey("dbo.TrainingManager", "ManagerID", "dbo.Manager");
            DropForeignKey("dbo.TrainingManager", "StudentID", "dbo.Student");
            DropForeignKey("dbo.ProjectManager", "StudentID", "dbo.Student");
            DropForeignKey("dbo.ProjectInternManager", "StudentID", "dbo.Student");
            DropForeignKey("dbo.ProjectManager", "ProjectID", "dbo.Project");
            DropForeignKey("dbo.ProjectManager", "ManagerID", "dbo.Manager");
            DropForeignKey("dbo.ProjectInternManager", "ManagerID", "dbo.Manager");
            DropForeignKey("dbo.ProjectInternManager", "InternshipID", "dbo.Internship");
            DropForeignKey("dbo.TrainingProgram", "SpecializeID", "dbo.Specialize");
            DropForeignKey("dbo.StudentCV", "SpecializeID", "dbo.Specialize");
            DropForeignKey("dbo.StudentCV", "KnowUsID", "dbo.KnowU");
            DropForeignKey("dbo.StudentCV", "ExpectedLocationID", "dbo.ExpectedLocation");
            DropIndex("dbo.Login", new[] { "RoleID" });
            DropIndex("dbo.UserPermission", new[] { "FunctionID" });
            DropIndex("dbo.UserPermission", new[] { "Username" });
            DropIndex("dbo.ProjectManager", new[] { "StudentID" });
            DropIndex("dbo.ProjectManager", new[] { "ProjectID" });
            DropIndex("dbo.ProjectManager", new[] { "ManagerID" });
            DropIndex("dbo.ProjectInternManager", new[] { "InternshipID" });
            DropIndex("dbo.ProjectInternManager", new[] { "ProjectInternID" });
            DropIndex("dbo.ProjectInternManager", new[] { "ManagerID" });
            DropIndex("dbo.ProjectInternManager", new[] { "StudentID" });
            DropIndex("dbo.TrainingManager", new[] { "TrainingProgramID" });
            DropIndex("dbo.TrainingManager", new[] { "StageID" });
            DropIndex("dbo.TrainingManager", new[] { "StudentID" });
            DropIndex("dbo.TrainingManager", new[] { "ManagerID" });
            DropIndex("dbo.TrainingManager", new[] { "InternshipID" });
            DropIndex("dbo.TrainingProgram", new[] { "SpecializeID" });
            DropIndex("dbo.StudentCV", new[] { "ExpectedLocationID" });
            DropIndex("dbo.StudentCV", new[] { "SpecializeID" });
            DropIndex("dbo.StudentCV", new[] { "KnowUsID" });
            DropTable("dbo.Role");
            DropTable("dbo.Login");
            DropTable("dbo.UserPermission");
            DropTable("dbo.Function");
            DropTable("dbo.Stage");
            DropTable("dbo.ProjectIntern");
            DropTable("dbo.Student");
            DropTable("dbo.Project");
            DropTable("dbo.ProjectManager");
            DropTable("dbo.Manager");
            DropTable("dbo.ProjectInternManager");
            DropTable("dbo.Internship");
            DropTable("dbo.TrainingManager");
            DropTable("dbo.TrainingProgram");
            DropTable("dbo.Specialize");
            DropTable("dbo.KnowU");
            DropTable("dbo.StudentCV");
            DropTable("dbo.ExpectedLocation");
        }
    }
}
