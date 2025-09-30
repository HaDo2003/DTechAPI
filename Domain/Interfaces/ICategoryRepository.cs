using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface ICategoryRepository
    {
        Task<int?> GetCategoryIdByNameAsync(string categoryName);
        Task<Category?> GetCategoryBySlugAsync(string slug);
        Task<List<Category>?> GetAllCategoriesAsync();
        Task<Category?> GetCategoryByIdAsync(int categoryId);
        Task<bool> CheckIfCategoryExistsAsync(Category category);
        Task<(bool Success, string Message)> CreateCategoryAsync(Category category);
        Task<(bool Success, string Message)> UpdateCategoryAsync(Category category);
        Task<(bool Success, string Message)> DeleteCategoryAsync(int categoryId);
    }
}
