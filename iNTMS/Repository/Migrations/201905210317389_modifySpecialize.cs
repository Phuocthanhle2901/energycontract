namespace Repository.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class modifySpecialize : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.EmailTemplate", "Body1", c => c.String());
            AddColumn("dbo.EmailTemplate", "Body2", c => c.String());
            AddColumn("dbo.EmailTemplate", "Body3", c => c.String());
            AddColumn("dbo.EmailTemplate", "Body4", c => c.String());
            AddColumn("dbo.Specialize", "MinimumToPass", c => c.Int(nullable: false));
            DropColumn("dbo.EmailTemplate", "Body");
        }
        
        public override void Down()
        {
            AddColumn("dbo.EmailTemplate", "Body", c => c.String());
            DropColumn("dbo.Specialize", "MinimumToPass");
            DropColumn("dbo.EmailTemplate", "Body4");
            DropColumn("dbo.EmailTemplate", "Body3");
            DropColumn("dbo.EmailTemplate", "Body2");
            DropColumn("dbo.EmailTemplate", "Body1");
        }
    }
}
