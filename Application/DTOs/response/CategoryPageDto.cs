namespace DTech.Application.DTOs.response
{
    public class CategoryPageDto
    {
        public string? Title { get; set; }
        public List<ProductDto>? Products { get; set; }
        public List<BrandDto?>? Brands { get; set; }
        public string? InitialSort { get; set; }
        public string? CategorySlug { get; set; }
    }
}
