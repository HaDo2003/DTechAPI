using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface ICategoryRepository
    {
        Task<int?> GetCategoryIdByNameAsync(string categoryName);
        Task<Category?> GetCategoryBySlugAsync(string slug);
    }
}
