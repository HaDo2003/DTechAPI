using System.ComponentModel.DataAnnotations;

namespace DTech.Application.DTOs.request
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
