namespace Repository.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class progress : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Progress",
                c => new
                    {
                        ProgressID = c.String(nullable: false, maxLength: 128),
                        ProgressContent = c.String(),
                        DateCreated = c.DateTime(nullable: false),
                        LastUpdated = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.ProgressID);
            
            AddColumn("dbo.Student", "ProgressID", c => c.String(maxLength: 128));
            CreateIndex("dbo.Student", "ProgressID");
            AddForeignKey("dbo.Student", "ProgressID", "dbo.Progress", "ProgressID");
            DropColumn("dbo.Student", "IsPassTraining");
            DropColumn("dbo.Student", "IsPassProjectIntern");
            DropColumn("dbo.Student", "IsPassProject");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Student", "IsPassProject", c => c.Boolean(nullable: false));
            AddColumn("dbo.Student", "IsPassProjectIntern", c => c.Boolean(nullable: false));
            AddColumn("dbo.Student", "IsPassTraining", c => c.Boolean(nullable: false));
            DropForeignKey("dbo.Student", "ProgressID", "dbo.Progress");
            DropIndex("dbo.Student", new[] { "ProgressID" });
            DropColumn("dbo.Student", "ProgressID");
            DropTable("dbo.Progress");
        }
    }
}
