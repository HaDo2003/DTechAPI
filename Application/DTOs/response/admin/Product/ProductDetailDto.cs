using DTech.Application.DTOs.response;
using Microsoft.AspNetCore.Http;

namespace DTech.Application.DTOs.Response.Admin.Product
{
    public class ProductDetailDto
    {
        public int? Id { get; set; }
        public string? Name { get; set; }
        public string? Slug { get; set; }
        public string? Warranty { get; set; }
        public string? StatusProduct { get; set; }
        public decimal? InitialCost { get; set; }
        public decimal? Price { get; set; }
        public decimal? Discount { get; set; }
        public decimal? PriceAfterDiscount { get; set; }
        public DateOnly? EndDateDiscount { get; set; }
        public DateOnly? DateOfManufacture { get; set; }
        public string? MadeIn { get; set; }
        public int? Views { get; set; }
        public string? PromotionalGift { get; set; }
        public string? Photo { get; set; }
        public IFormFile? PhotoUpload { get; set; }
        public string? Description { get; set; }
        public int? BrandId { get; set; }
        public int? CategoryId { get; set; }
        public DateTime? CreateDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
