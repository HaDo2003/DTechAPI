namespace DTech.Application.DTOs.request
{
    public class AddAddressDto
    {
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public int? ProvinceId { get; set; }
        public string? Address { get; set; }
        public bool IsDefault { get; set; } = false;
    }
}
