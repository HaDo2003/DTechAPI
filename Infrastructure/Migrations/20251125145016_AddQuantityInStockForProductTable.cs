using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DTech.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddQuantityInStockForProductTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StatusProduct",
                table: "Products");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "StatusProduct",
                table: "Products",
                type: "boolean",
                nullable: true);
        }
    }
}
