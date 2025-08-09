using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
    }
}
