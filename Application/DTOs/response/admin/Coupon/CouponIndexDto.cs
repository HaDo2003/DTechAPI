namespace DTech.Application.DTOs.Response.Admin.Coupon
{
    public class CouponIndexDto
    {
        public int? Id { get; set; }
        public string? Name { get; set; }
        public string? Code { get; set; }
        public string? DiscountType { get; set; }
        public decimal? Discount { get; set; }
        public int? Condition { get; set; }
        public string? Detail { get; set; }
    }
}
