using DTech.Application.DTOs.Response;

namespace DTech.Application.Interfaces
{
    public interface INewsService
    {
        Task<PostLayoutDto?> GetAllPostCategoryAsync();
        Task<InitialNewsPage?> GetInitialPageDataAsync();
        Task<PostCategoyPageDto?> GetPostsByCategoryAsync(string categorySlug, int page, int pageSize);
        Task<PostDto?> GetPostBySlugAsync(string slug);
    }
}
