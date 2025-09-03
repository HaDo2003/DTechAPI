namespace DTech.Application.DTOs.response
{
    public class CustomerCouponDto
    {
        public int? CouponId { get; set; }
        public string? Name { get; set; }
        public string? Code { get; set; }
        public int? Condition { get; set; }
        public decimal? Discount { get; set; }
        public int? MaxDiscount { get; set; }
    }
}
