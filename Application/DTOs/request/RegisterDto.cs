using System.ComponentModel.DataAnnotations;

namespace DTech.Application.DTOs.request
{
    public class RegisterDto
    {
        public string? FullName { get; set; } = string.Empty;

        public required string Account { get; set; }

        public string? Email { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; } = string.Empty;

        public string? Gender { get; set; }

        public DateOnly? DateOfBirth { get; set; }

        public string? Province { get; set; } = string.Empty;
        public string? Address { get; set; } = string.Empty;

        public required string Password { get; set; }  
    }
}
