using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface IPostCategoryRepository
    {
        Task<List<PostCategory>?> GetAllPostCategoriesAsync();
        Task<List<PostCategory>?> GetAvailablePostCategoriesAsync();
        Task<PostCategory?> GetPostCategoryByIdAsync(int postCategoryId);
        Task<bool> CheckIfPostCategoryExistsAsync(PostCategory postCategory);
        Task<(bool Success, string Message)> CreatePostCategoryAsync(PostCategory postCategory);
        Task<(bool Success, string Message)> UpdatePostCategoryAsync(PostCategory postCategory);
        Task<(bool Success, string Message)> DeletePostCategoryAsync(int postCategoryId);
    }
}
