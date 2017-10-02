namespace ContalibreWebApi.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Mig11 : DbMigration
    {
        public override void Up()
        {
            RenameColumn(table: "dbo.Contabilidads", name: "User_Id", newName: "UserId");
            RenameIndex(table: "dbo.Contabilidads", name: "IX_User_Id", newName: "IX_UserId");
        }
        
        public override void Down()
        {
            RenameIndex(table: "dbo.Contabilidads", name: "IX_UserId", newName: "IX_User_Id");
            RenameColumn(table: "dbo.Contabilidads", name: "UserId", newName: "User_Id");
        }
    }
}
