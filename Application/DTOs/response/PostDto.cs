namespace DTech.Application.DTOs.Response
{
    public class PostDto
    {
        public int PostId { get; set; }
        public string? Name { get; set; }
        public string? Slug { get; set; }
        public string? Description { get; set; }
        public bool? IsFeatured { get; set; }
        public bool? IsMain { get; set; }
        public int? PostCategoryId { get; set; }
        public string? PostCategory { get; set; }
        public string? PostCategorySlug { get; set; }
        public string? Image { get; set; }
        public DateTime? PostDate { get; set; }
        public string? PostBy { get; set; }
    }
}
