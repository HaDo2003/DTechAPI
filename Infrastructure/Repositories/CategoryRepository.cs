using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;


namespace DTech.Infrastructure.Repositories
{
    public class CategoryRepository(DTechDbContext context) : ICategoryRepository
    {
        public async Task<int?> GetCategoryIdByNameAsync(string? name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return null;
            }
            var categoryId = await context.Categories
                .Where(c => c.Name == name)
                .Select(c => c.CategoryId)
                .FirstOrDefaultAsync();
            return categoryId;
        }

        public async Task<Category?> GetCategoryBySlugAsync(string? slug)
        {
            if (string.IsNullOrEmpty(slug))
            {
                return null;
            }
            var category = await context.Categories
                .AsNoTracking()
                .Include(c => c.InverseParent)
                .Include(c => c.Parent)
                .FirstOrDefaultAsync(c => c.Slug == slug);
            return category;
        }
    }
}