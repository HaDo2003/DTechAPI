

namespace DTech.Domain.Interfaces
{
    public interface ICategoryRepository
    {
        Task<int?> GetCategoryIdByNameAsync(string categoryName);
    }
}
