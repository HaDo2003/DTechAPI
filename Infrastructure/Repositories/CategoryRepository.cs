using DTech.Domain.Entities;
using DTech.Domain.Enums;
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

        public async Task<List<Category>?> GetAllCategoriesAsync()
        {
            return await context.Categories
                .AsNoTracking()
                .Include(c => c.InverseParent)
                .Include(c => c.Parent)
                .OrderBy(c => c.CategoryId)
                .ToListAsync();
        }

        public async Task<Category?> GetCategoryByIdAsync(int categoryId)
        {
            if (categoryId <= 0)
                return null;

            var category = await context.Categories
                .AsNoTracking()
                .Include(c => c.InverseParent)
                .Include(c => c.Parent)
                .FirstOrDefaultAsync(c => c.CategoryId == categoryId);

            return category;
        }

        public async Task<bool> CheckIfCategoryExistsAsync(Category category)
        {
            if (category == null)
                return false;

            if (category.CategoryId > 0)
            {
                return await context.Categories.AnyAsync(c =>
                    c.Slug == category.Slug &&
                    c.CategoryId != category.CategoryId);
            }
            else
            {
                return await context.Categories.AnyAsync(c =>
                    c.Slug == category.Slug);
            }
        }

        public async Task<(bool Success, string Message)> CreateCategoryAsync(Category category)
        {
            if (category == null)
                return (false, "Category is null");

            await context.Categories.AddAsync(category);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Category created successfully");
            else
                return (false, "Failed to create category");
        }

        public async Task<(bool Success, string Message)> UpdateCategoryAsync(Category category)
        {
            var existingCategory = await context.Categories.FindAsync(category.CategoryId);
            if (existingCategory == null)
                return (false, "Category not found");

            existingCategory.Name = category.Name;
            existingCategory.Slug = category.Slug;
            existingCategory.Status = category.Status;
            existingCategory.UpdateDate = DateTime.UtcNow;
            existingCategory.UpdatedBy = category.UpdatedBy;
            existingCategory.ParentId = category.ParentId;

            context.Categories.Update(existingCategory);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Category updated successfully");
            else
                return (false, "Failed to update category");
        }

        public async Task<(bool Success, string Message)> DeleteCategoryAsync(int categoryId)
        {
            var category = await context.Categories.FindAsync(categoryId);
            if (category == null)
                return (false, "Category not found");

            context.Categories.Remove(category);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Category deleted successfully");
            else
                return (false, "Failed to delete category");
        }
    }
}