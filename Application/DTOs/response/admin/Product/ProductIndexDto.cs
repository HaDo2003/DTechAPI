namespace DTech.Application.DTOs.Response.Admin.Product
{
    public class ProductIndexDto
    {
        public int? Id { get; set; }
        public string? Name { get; set; }
        public decimal? Price { get; set; }
        public int? QuantityInStock { get; set; } = 0;
    }
}
