using Microsoft.AspNetCore.Http;

namespace DTech.Application.DTOs.request
{
    public class UpdateProfileDto
    {
        public string UserName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public DateOnly? DateOfBirth { get; set; }
        public string Image { get; set; } = string.Empty;
        public IFormFile? ImageUpload { get; set; }
    }
}
