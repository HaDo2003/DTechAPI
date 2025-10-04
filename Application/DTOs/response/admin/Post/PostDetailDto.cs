using DTech.Domain.Enums;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace DTech.Application.DTOs.Response.Admin.Post
{
    public class PostDetailDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public StatusEnums Status { get; set; } = StatusEnums.Available;
        public DateTime? PostDate { get; set; }
        public string? PostBy { get; set; }
        public int? PostCategoryId { get; set; }
        public string? PostCategory { get; set; }
        public string? Image { get; set; }
        public IFormFile? ImageUpload { get; set; }
    }
}
