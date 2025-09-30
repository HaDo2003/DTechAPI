namespace DTech.Application.DTOs.Response.Admin.Order
{
    public class OrderDetailDto
    {
        public string? Id { get; set; }
        public string? BillingName { get; set; }
        public string? BillingPhone { get; set; }
        public string? BillingAddress { get; set; }
        public string? ShippingName { get; set; }
        public string? ShippingPhone { get; set; }
        public string? ShippingAddress { get; set; }
        public DateOnly? OrderDate { get; set; }
        public string? Status { get; set; }
        public string? Note { get; set; }
        public string? ReductionCode { get; set; }
        public decimal? FinalCost { get; set; }
    }
}
