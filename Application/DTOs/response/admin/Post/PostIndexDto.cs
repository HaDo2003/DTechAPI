using System.ComponentModel.DataAnnotations;

namespace DTech.Application.DTOs.Response.Admin.Post
{
    public class PostIndexDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public DateTime? PostDate { get; set; }
        public string? PostBy { get; set; }
        public string? PostCategory { get; set; }
    }
}
