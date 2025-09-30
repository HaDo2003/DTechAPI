using DTech.Domain.Enums;

namespace DTech.Application.DTOs.Response.Admin.Coupon
{
    public class CouponDetailDto
    {
        public string? Name { get; set; }
        public string? Slug { get; set; }
        public string? Code { get; set; }
        public string? DiscountType { get; set; }
        public decimal? Discount { get; set; }
        public int? MaxDiscount { get; set; }
        public int? Condition { get; set; }
        public string? Detail { get; set; }
        public StatusEnums Status { get; set; } = StatusEnums.Available;
        public DateOnly? EndDate { get; set; }
        public DateTime? CreateDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
