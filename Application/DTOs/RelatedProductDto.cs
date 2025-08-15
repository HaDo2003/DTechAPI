namespace DTech.Application.DTOs
{
    public class RelatedProductDto
    {
        public int ProductId { get; set; }
        public string? Name { get; set; }
        public string? Slug { get; set; }
        public decimal? Price { get; set; }
        public decimal? Discount { get; set; }
        public decimal? PriceAfterDiscount { get; set; }
        public string? Photo { get; set; }
        public CategoryDto? Category { get; set; }
        public BrandDto? Brand { get; set; }
    }
}
