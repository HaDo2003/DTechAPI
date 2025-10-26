using DTech.Application.DTOs.Response;

namespace DTech.Application.DTOs.response
{
    public class CartProductDto
    {
        public int? Id { get; set; }
        public int? ProductId { get; set; }
        public int? Quantity { get; set; }
        public string? Name { get; set; }
        public decimal? Price { get; set; }
        public decimal? Discount { get; set; }
        public decimal? PriceAfterDiscount { get; set; }
        public string? Photo {  get; set; }
        public ProductColorDto? Color { get; set; }
    }
}
