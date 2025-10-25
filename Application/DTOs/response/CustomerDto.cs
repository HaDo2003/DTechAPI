namespace DTech.Application.DTOs.response
{
    public class CustomerDto
    {
        public bool Success { get; set; } = true;
        public string Message { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string? FullName { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; } = string.Empty;
        public string? Gender { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? Image { get; set; }
        public ICollection<CustomerAddressDto> CustomerAddresses { get; set; } = [];
        public ICollection<CustomerCouponDto> CustomerCoupons { get; set; } = [];
        public ICollection<OrderDto> Orders { get; set; } = [];
    }
}
