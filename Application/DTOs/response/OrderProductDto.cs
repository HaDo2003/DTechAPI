using DTech.Application.DTOs.Response;

namespace DTech.Application.DTOs.response
{
    public class OrderProductDto
    {
        public int? Id { get; set; }
        public string? Name { get; set; }
        public string? Photo { get; set; }
        public int? Quantity { get; set; }
        public decimal? CostAtPurchase { get; set; }
        public decimal? Price { get; set; }
        public ProductColorDto? ProductColor { get; set; }
    }
}
