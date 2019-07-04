namespace Repository.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class modifydb : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.TrainingManager", "IsPass", c => c.Boolean(nullable: false));
            AddColumn("dbo.ProjectInternManager", "IsPass", c => c.Boolean(nullable: false));
            AddColumn("dbo.ProjectManager", "IsPass", c => c.Boolean(nullable: false));
            DropColumn("dbo.TrainingProgram", "IsPass");
            DropColumn("dbo.TrainingManager", "Pass");
            DropColumn("dbo.Project", "IsPass");
            DropColumn("dbo.ProjectIntern", "IsPass");
        }
        
        public override void Down()
        {
            AddColumn("dbo.ProjectIntern", "IsPass", c => c.Boolean(nullable: false));
            AddColumn("dbo.Project", "IsPass", c => c.Boolean(nullable: false));
            AddColumn("dbo.TrainingManager", "Pass", c => c.Boolean(nullable: false));
            AddColumn("dbo.TrainingProgram", "IsPass", c => c.Boolean(nullable: false));
            DropColumn("dbo.ProjectManager", "IsPass");
            DropColumn("dbo.ProjectInternManager", "IsPass");
            DropColumn("dbo.TrainingManager", "IsPass");
        }
    }
}
