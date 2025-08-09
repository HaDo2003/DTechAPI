using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DTech.Infrastructure.Repositories
{
    public class ProductRepository(DTechDbContext context) : IProductRepository
    {
        public async Task<List<Product>> GetAccessoriesAsync()
        {
            var products = await context.Products
                .AsNoTracking()
                .Include(a => a.Brand)
                .Include(a => a.Category)
                .Where(a => a.Category!.Name != "Laptop" && a.Category!.Name != "Smart Phone" && a.Category!.Name != "Tablet" && a.Status == 1)
                .ToListAsync();

            // Shuffle the list randomly
            var random = new Random();
            return [.. products.OrderBy(p => random.Next())];
        }

        public async Task<List<Product>> GetDiscountedProductsAsync()
        {
            var products = await context.Products
                .AsNoTracking()
                .Include(a => a.Brand)
                .Include(a => a.Category)
                .Where(a => a.Discount != null && a.Discount > 0 && a.Status == 1)
                .OrderByDescending(a => a.Discount)
                .ToListAsync();
            return products;
        }

        public async Task<List<Product>> GetProductsByCategoryIdAsync(List<int> id)
        {
            if (id == null)
            {
                return [];
            }
            var products = await context.Products
                .AsNoTracking()
                .Include(a => a.Brand)
                .Include(a => a.Category)
                .Where(p => p.CategoryId != null && id.Contains(p.CategoryId.Value) && p.Status == 1)
                .OrderByDescending(a => a.ProductId)
                .ToListAsync();
            return products;
        }
    }
}
