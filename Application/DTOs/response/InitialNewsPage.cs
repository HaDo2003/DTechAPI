namespace DTech.Application.DTOs.Response
{
    public class InitialNewsPage
    {
        public List<PostDto> Posts { get; set; } = [];
        public List<PostDto> SidebarPosts { get; set; } = [];
        public List<PostDto> FeaturedPosts { get; set; } = [];
        public List<PostDto> MainPosts { get; set; } = [];
    }
}
