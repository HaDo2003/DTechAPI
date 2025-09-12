namespace DTech.Application.DTOs.response
{
    public class CheckOutDto : MessageResponse
    {
        public bool IsBuyNow { get; set; }
        // Customer Information
        public string? Email { get; set; }

        // Billing Information
        public string? BillingName { get; set; }
        public string? BillingPhone { get; set; }
        public string? BillingAddress { get; set; }

        // Shipping Information (when different from billing)
        public string? ShippingName { get; set; }
        public string? ShippingPhone { get; set; }
        public string? ShippingAddress { get; set; }

        // Payment Information
        public int PaymentMethod { get; set; }

        // Order Information
        public string? Note { get; set; }
        public string? ReductionCode { get; set; }

        // Order Summary
        public OrderSummary OrderSummary { get; set; } = new OrderSummary();

        // Collections for dropdowns
        public List<CustomerAddressDto> CustomerAddresses { get; set; } = [];
        public List<PaymentMethodDto> PaymentMethods { get; set; } = [];
    }
}
