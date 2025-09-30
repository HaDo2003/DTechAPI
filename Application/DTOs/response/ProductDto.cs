using DTech.Domain.Entities;

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

        public virtual ICollection<ProductCommentDto> ProductComments { get; set; } = [];

        public virtual ICollection<ProductImageDto> ProductImages { get; set; } = [];

        public virtual ICollection<SpecificationDto> Specifications { get; set; } = [];
        public virtual ICollection<RelatedProductDto> RelatedProducts { get; set; } = [];
    }
}
