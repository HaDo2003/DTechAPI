using System.ComponentModel.DataAnnotations;

namespace DTech.Application.DTOs.Response.Admin.Post
{
    public class PostIndexDto
    {
        public string? Name { get; set; }
        public DateTime? PostDate { get; set; }
        public string? PostBy { get; set; }
        public string? PostCategory { get; set; }
    }
}
