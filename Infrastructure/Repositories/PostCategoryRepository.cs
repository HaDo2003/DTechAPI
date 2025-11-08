using DTech.Domain.Entities;
using DTech.Domain.Enums;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DTech.Infrastructure.Repositories
{
    public class PostCategoryRepository(DTechDbContext context) : IPostCategoryRepository
    {
        public async Task<PostCategory?> GetPostCategoryBySlugAsync(string categorySlug)
        {
            if (string.IsNullOrWhiteSpace(categorySlug))
                return null;

            return await context.PostCategories
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Slug == categorySlug);
        }
        public async Task<List<PostCategory>?> GetAllPostCategoriesAsync()
        {
            return await context.PostCategories
                .AsNoTracking()
                .OrderBy(c => c.CategoryId)
                .ToListAsync();
        }

        public async Task<List<PostCategory>?> GetAvailablePostCategoriesAsync()
        {
            return await context.PostCategories
                .AsNoTracking()
                .Where(c => c.Status == StatusEnums.Available)
                .OrderBy(c => c.CategoryId)
                .ToListAsync();
        }

        public async Task<PostCategory?> GetPostCategoryByIdAsync(int postCategoryId)
        {
            if (postCategoryId <= 0)
                return null;

            return await context.PostCategories.FindAsync(postCategoryId);
        }

        public async Task<bool> CheckIfPostCategoryExistsAsync(PostCategory postCategory)
        {
            if (postCategory == null)
                return false;

            if (postCategory.CategoryId > 0)
            {
                return await context.PostCategories.AnyAsync(c =>
                    c.Slug == postCategory.Slug &&
                    c.CategoryId != postCategory.CategoryId);
            }
            else
            {
                return await context.PostCategories.AnyAsync(c =>
                    c.Slug == postCategory.Slug);
            }
        }

        public async Task<(bool Success, string Message)> CreatePostCategoryAsync(PostCategory postCategory)
        {
            if (postCategory == null)
                return (false, "Post category is null");

            await context.PostCategories.AddAsync(postCategory);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Post category created successfully");
            else
                return (false, "Failed to create post category");
        }

        public async Task<(bool Success, string Message)> UpdatePostCategoryAsync(PostCategory postCategory)
        {
            var existingCategory = await context.PostCategories.FindAsync(postCategory.CategoryId);
            if (existingCategory == null)
                return (false, "Post category not found");

            existingCategory.Name = postCategory.Name;
            existingCategory.Slug = postCategory.Slug;
            existingCategory.Status = postCategory.Status;
            existingCategory.UpdateDate = DateTime.UtcNow;
            existingCategory.UpdatedBy = postCategory.UpdatedBy;

            context.PostCategories.Update(existingCategory);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Post category updated successfully");
            else
                return (false, "Failed to update post category");
        }

        public async Task<(bool Success, string Message)> DeletePostCategoryAsync(int postCategoryId)
        {
            var postCategory = await context.PostCategories.FindAsync(postCategoryId);
            if (postCategory == null)
                return (false, "Post category not found");

            context.PostCategories.Remove(postCategory);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Post category deleted successfully");
            else
                return (false, "Failed to delete post category");
        }
    }
}
