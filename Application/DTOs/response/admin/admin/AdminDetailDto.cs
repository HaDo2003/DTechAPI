using Microsoft.AspNetCore.Http;

namespace DTech.Application.DTOs.response.admin.admin
{
    public class AdminDetailDto
    {
        public string? FullName { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Gender { get; set; }
        public string? RoleId { get; set; }
        public string? Role { get; set; }
        public string? Image { get; set; }
        public IFormFile? ImageUpload { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public DateTime? CreateDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public string? UpdatedBy { get; set; }
    }
}