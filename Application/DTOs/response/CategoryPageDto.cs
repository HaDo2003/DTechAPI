namespace DTech.Application.DTOs.response
{
    public class CategoryPageDto
    {
        public string? Title { get; set; }
        public IEnumerable<ProductDto>? Products { get; set; }
        public IEnumerable<BrandDto>? Brands { get; set; }
        public string? InitialSort { get; set; }
        public string? CategorySlug { get; set; }
    }
}
