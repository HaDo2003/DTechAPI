using DTech.Application.DTOs.Response;

namespace DTech.Application.DTOs.response
{
    public class OrderSummary
    {
        public List<OrderItem> Items { get; set; } = new List<OrderItem>();
        public int ItemCount { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? ShippingFee { get; set; }
        public decimal? DiscountAmount { get; set; }
        public decimal? Total { get; set; }
    }

    public class OrderItem
    {
        public int? ProductId { get; set; }
        public string? Name { get; set; }
        public string? Photo { get; set; }
        public int Quantity { get; set; }
        public decimal? Price { get; set; }
        public string? PromotionalGift { get; set; }
        public ProductColorDto? Color { get; set; }
    }

    public class OrderSummaryResDto
    {
        public bool Success { get; set; } = false;
        public string? Message { get; set; }
        public decimal? DiscountAmount { get; set; }
        public decimal? Total { get; set; }
    }
}
