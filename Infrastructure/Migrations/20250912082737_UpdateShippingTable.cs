using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DTech.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateShippingTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DelivaryDate",
                table: "Shippings",
                newName: "DeliveryDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DeliveryDate",
                table: "Shippings",
                newName: "DelivaryDate");
        }
    }
}
