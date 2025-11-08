using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface IPostRepository
    {
        // For Customer
        Task<List<Post>?> GetPostsAsync(string type);
        Task<IQueryable<Post>?> GetPostsByCategorySlugAsync(string categorySlug);
        //For Admin
        Task<List<Post>?> GetAllPostsAsync();
        Task<Post?> GetPostByIdAsync(int postId);
        Task<bool> CheckIfPostExistsAsync(Post post);
        Task<(bool Success, string Message)> CreatePostAsync(Post post);
        Task<(bool Success, string Message)> UpdatePostAsync(Post post);
        Task<(bool Success, string Message)> DeletePostAsync(int postId);
    }
}
