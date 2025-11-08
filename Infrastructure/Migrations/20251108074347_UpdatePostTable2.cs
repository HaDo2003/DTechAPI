using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DTech.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePostTable2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Posts_PostCategories_CateId",
                table: "Posts");

            migrationBuilder.RenameColumn(
                name: "CateId",
                table: "Posts",
                newName: "PostCategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_Posts_CateId",
                table: "Posts",
                newName: "IX_Posts_PostCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_PostCategories_PostCategoryId",
                table: "Posts",
                column: "PostCategoryId",
                principalTable: "PostCategories",
                principalColumn: "CategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Posts_PostCategories_PostCategoryId",
                table: "Posts");

            migrationBuilder.RenameColumn(
                name: "PostCategoryId",
                table: "Posts",
                newName: "CateId");

            migrationBuilder.RenameIndex(
                name: "IX_Posts_PostCategoryId",
                table: "Posts",
                newName: "IX_Posts_CateId");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_PostCategories_CateId",
                table: "Posts",
                column: "CateId",
                principalTable: "PostCategories",
                principalColumn: "CategoryId");
        }
    }
}
