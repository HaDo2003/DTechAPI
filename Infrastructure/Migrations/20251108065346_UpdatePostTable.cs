using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DTech.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePostTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFeatured",
                table: "Posts",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsMain",
                table: "Posts",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFeatured",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "IsMain",
                table: "Posts");
        }
    }
}
