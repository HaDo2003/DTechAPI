using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DTech.Infrastructure.Repositories
{
    public class BrandRepository(DTechDbContext context) : IBrandRepository
    {
        public async Task<Brand?> GetBrandBySlugAsync(string? slug)
        {
            if (string.IsNullOrEmpty(slug))
            {
                return null;
            }
            var brand = await context.Brands
                .AsNoTracking()
                .FirstOrDefaultAsync(a => a.Slug == slug);
            return brand;
        }
    }
}
