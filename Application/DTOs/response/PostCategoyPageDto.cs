namespace DTech.Application.DTOs.Response
{
    public class PostCategoyPageDto
    {
        public string Title { get; set; } = "All Posts";
        public List<PostDto> Posts { get; set; } = [];
        public int TotalPages { get; set; }
        public int TotalItems { get; set; }
    }
}
