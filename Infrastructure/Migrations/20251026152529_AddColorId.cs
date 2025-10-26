using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DTech.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddColorId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ColorId",
                table: "OrderProducts",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ColorId",
                table: "CartProducts",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderProducts_ColorId",
                table: "OrderProducts",
                column: "ColorId");

            migrationBuilder.CreateIndex(
                name: "IX_CartProducts_ColorId",
                table: "CartProducts",
                column: "ColorId");

            migrationBuilder.AddForeignKey(
                name: "FK_CartProducts_ProductColors_ColorId",
                table: "CartProducts",
                column: "ColorId",
                principalTable: "ProductColors",
                principalColumn: "ColorId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderProducts_ProductColors_ColorId",
                table: "OrderProducts",
                column: "ColorId",
                principalTable: "ProductColors",
                principalColumn: "ColorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CartProducts_ProductColors_ColorId",
                table: "CartProducts");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderProducts_ProductColors_ColorId",
                table: "OrderProducts");

            migrationBuilder.DropIndex(
                name: "IX_OrderProducts_ColorId",
                table: "OrderProducts");

            migrationBuilder.DropIndex(
                name: "IX_CartProducts_ColorId",
                table: "CartProducts");

            migrationBuilder.DropColumn(
                name: "ColorId",
                table: "OrderProducts");

            migrationBuilder.DropColumn(
                name: "ColorId",
                table: "CartProducts");
        }
    }
}
