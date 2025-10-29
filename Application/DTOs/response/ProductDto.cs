using DTech.Application.DTOs.Response;

namespace DTech.Application.DTOs.response
{
    public class ProductDto
    {
        public int ProductId { get; set; }
        public string? Name { get; set; }
        public string? Slug { get; set; }
        public string? Warranty { get; set; }
        public bool? StatusProduct { get; set; }
        public decimal? Price { get; set; }
        public decimal? Discount { get; set; }
        public decimal? PriceAfterDiscount { get; set; }
        public DateOnly? EndDateDiscount { get; set; }
        public int? Views { get; set; }
        public DateOnly? DateOfManufacture { get; set; }
        public string? MadeIn { get; set; }
        public string? PromotionalGift { get; set; }
        public string? Photo { get; set; }
        public string? Description { get; set; }

        public CategoryDto? Category { get; set; }
        public BrandDto? Brand { get; set; }
        public List<ProductCommentDto>? ProductComments { get; set; } = [];
        public List<ProductImageDto>? ProductImages { get; set; } = [];
        public List<ProductColorDto>? ProductColors { get; set; } = [];
        public List<ProductModelDto>? ProductModels { get; set; } = [];
        public List<SpecificationDto>? Specifications { get; set; } = [];
        public List<RelatedProductDto>? RelatedProducts { get; set; } = [];
    }
}
