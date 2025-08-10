
namespace DTech.Application.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Photo { get; set; }
        public string? Slug { get; set; }
        public decimal? Price { get; set; }
        public decimal? FinalPrice { get; set; }
        public decimal? Discount { get; set; }
        public string? PromotionalGift { get; set; }

        public CategoryDto? Category { get; set; }
        public BrandDto? Brand { get; set; }
    }
}
