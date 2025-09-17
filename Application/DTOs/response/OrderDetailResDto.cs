namespace DTech.Application.DTOs.response
{
    public class OrderDetailResDto : MessageResponse
    {
        public string? OrderId { get; set; }
        public DateOnly? OrderDate { get; set; }
        public string? Name { get; set; }
        public string? NameReceive { get; set; }
        public string? ShippingAddress { get; set; }
        public string? Address { get; set; }
        public string? StatusName { get; set; }
        public string? Note { get; set; }
        public decimal? CostDiscount { get; set; }
        public decimal? ShippingCost { get; set; }
        public decimal? FinalCost { get; set; }
        public PaymentDto? Payment { get; set; }
        public List<OrderProductDto>? OrderProducts { get; set; }
    }

    public class PaymentDto
    {
        public int? Status { get; set; }
        public string? PaymentMethodName { get; set; }
    }
}
