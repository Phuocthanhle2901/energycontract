namespace Repository.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addEmailTeamplate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.EmailTemplate",
                c => new
                    {
                        id = c.Int(nullable: false, identity: true),
                        EmailFor = c.String(),
                        Subject = c.String(),
                        Body = c.String(),
                    })
                .PrimaryKey(t => t.id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.EmailTemplate");
        }
    }
}
