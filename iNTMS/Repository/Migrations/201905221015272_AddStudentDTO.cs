namespace Repository.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddStudentDTO : DbMigration
    {
        public override void Up()
        {
            DropTable("dbo.StudentDTO");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.StudentDTO",
                c => new
                    {
                        StudentDTOID = c.String(nullable: false, maxLength: 128),
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
                .PrimaryKey(t => t.StudentDTOID);
            
        }
    }
}
