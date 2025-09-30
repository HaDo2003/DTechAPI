using DTech.Domain.Entities;
using DTech.Domain.Enums;
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

        public async Task<List<Brand>?> GetAllBrandsAsync()
        {
            return await context.Brands
                .AsNoTracking()
                .Where(b => b.Status == StatusEnums.Available)
                .OrderBy(b => b.BrandId)
                .ToListAsync();
        }

        public async Task<Brand?> GetBrandByIdAsync(int brandId)
        {
            if (brandId <= 0)
                return null;

            return await context.Brands.FindAsync(brandId);
        }

        public async Task<bool> CheckIfBrandExistsAsync(Brand brand)
        {
            if (brand == null)
                return false;

            if (brand.BrandId > 0)
            {
                return await context.Brands.AnyAsync(b =>
                    b.Slug == brand.Slug &&
                    b.BrandId != brand.BrandId);
            }
            else
            {
                return await context.Brands.AnyAsync(b =>
                    b.Slug == brand.Slug);
            }
        }

        public async Task<(bool Success, string Message)> CreateBrandAsync(Brand brand)
        {
            if (brand == null)
                return (false, "Brand is null");

            await context.Brands.AddAsync(brand);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Brand created successfully");
            else
                return (false, "Failed to create brand");
        }

        public async Task<(bool Success, string Message)> UpdateBrandAsync(Brand brand)
        {
            var existingBrand = await context.Brands.FindAsync(brand.BrandId);
            if (existingBrand == null)
                return (false, "Brand not found");

            existingBrand.Name = brand.Name;
            existingBrand.Slug = brand.Slug;
            existingBrand.Status = brand.Status;
            existingBrand.Logo = brand.Logo;
            existingBrand.UpdateDate = DateTime.UtcNow;
            existingBrand.UpdatedBy = brand.UpdatedBy;

            context.Brands.Update(existingBrand);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Brand updated successfully");
            else
                return (false, "Failed to update brand");
        }

        public async Task<(bool Success, string Message)> DeleteBrandAsync(int brandId)
        {
            var brand = await context.Brands.FindAsync(brandId);
            if (brand == null)
                return (false, "Brand not found");

            context.Brands.Remove(brand);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Brand deleted successfully");
            else
                return (false, "Failed to delete brand");
        }
    }
}
