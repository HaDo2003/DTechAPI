namespace DTech.Application.DTOs.Response
{
    public class PostLayoutDto
    {
        public List<PostCategoryDto> Categories { get; set; } = [];
        public List<PostDto> FeaturedNews { get; set; } = [];
    }
}
