namespace DTech.Application.DTOs.response
{
    public class OrderResDto
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public string? OrderId { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? ShippingAddress { get; set; }
        public decimal? ShippingCost { get; set; }
        public decimal? CostDiscount { get; set; }
        public decimal? TotalCost { get; set; }
        public decimal? FinalCost { get; set; }
        public PaymentMethodDto? PaymentMethod { get; set; }
        public List<OrderProductDto>? OrderProducts { get; set; }

        public string? PaymentUrl { get; set; } // For third party payment like Vnpay or Momo
    }
}
