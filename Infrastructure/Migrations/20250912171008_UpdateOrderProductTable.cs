using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DTech.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateOrderProductTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InitialCost",
                table: "OrderProducts");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "InitialCost",
                table: "OrderProducts",
                type: "numeric",
                nullable: true);
        }
    }
}
