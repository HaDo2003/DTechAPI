using DTech.Application.DTOs.response;

namespace DTech.Application.DTOs.Response
{
    public class PaginatedProductResDto
    {
        public List<ProductDto> Products { get; set; } = [];
        public List<BrandDto?>? Brands { get; set; } = [];
        public int TotalPages { get; set; }
        public int TotalItems { get; set; }
        public string Title { get; set; } = "All Products";
    }
}
