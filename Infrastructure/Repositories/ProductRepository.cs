using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DTech.Infrastructure.Repositories
{
    public class ProductRepository(DTechDbContext context) : IProductRepository
    {
        // Repo for products
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

        public async Task<List<Product>> GetAccessoriesAsync(int brandId)
        {
            var products = await context.Products
                .AsNoTracking()
                .Include(a => a.Brand)
                .Include(a => a.Category)
                .Where(a => a.Category!.Name != "Laptop"
                    && a.Category!.Name != "Smart Phone"
                    && a.Category!.Name != "Tablet"
                    && a.BrandId == brandId
                    && a.Status == 1)
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

        public async Task<List<Product>> GetDiscountedProductsAsync(int brandId)
        {
            var products = await context.Products
                .AsNoTracking()
                .Include(a => a.Brand)
                .Include(a => a.Category)
                .Where(a => a.Discount != null && a.Discount > 0 && a.BrandId == brandId && a.Status == 1)
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
        public async Task<Product?> GetBySlugAsync(string? slug, int? categoryId, int? brandId)
        {
            if (slug == null || categoryId == null || brandId == null)
            {
                return null;
            }
            // Load product with basic info
            var product = await context.Products
                .AsNoTracking()
                .Include(a => a.Brand)
                .Include(a => a.Category)
                .FirstOrDefaultAsync(a => a.Slug == slug && a.Status == 1);

            if (product != null)
            {
                product.Specifications = await context.Specifications
                    .Where(s => s.ProductId == product.ProductId)
                    .ToListAsync();

                product.ProductImages = await context.ProductImages
                    .Where(i => i.ProductId == product.ProductId)
                    .ToListAsync();

                product.ProductComments = await context.ProductComments
                    .Where(c => c.ProductId == product.ProductId)
                    .ToListAsync();
            }
            return product;
        }

        public async Task<bool> IncrementProductViewsAsync(int? productId)
        {
            try
            {
                var product = await context.Products.FindAsync(productId);
                if (product != null)
                {
                    product.Views = (product.Views ?? 0) + 1;
                    context.Products.Update(product);
                    await context.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        public async Task<List<Product>> GetRelatedProductsAsync(int? brandId, int? productId)
        {
            if (brandId == null || productId == null)
            {
                return [];
            }
            var products = await context.Products
                .AsNoTracking()
                .Include(a => a.Brand)
                .Include(a => a.Category)
                .Where(a => a.BrandId == brandId && a.ProductId != productId && a.Status == 1)
                .OrderByDescending(a => a.ProductId)
                .Take(5)
                .ToListAsync();
            return products;
        }

        public async Task<List<Product>> GetByCategoryAndBrandAsync(int? categoryId, int? brandId)
        {
            if (categoryId == null || brandId == null)
            {
                return [];
            }
            var products = await context.Products
                .AsNoTracking()
                .Include(a => a.Brand)
                .Include(a => a.Category)
                .Where(a => a.CategoryId == categoryId && a.BrandId == brandId && a.Status == 1)
                .OrderByDescending(a => a.ProductId)
                .ToListAsync();
            return products;
        }

        public async Task<List<Product>> GetProductsByIdListAsync(List<int> ids)
        {
            if (ids == null || ids.Count == 0)
            {
                return [];
            }
            var products = await context.Products
                .AsNoTracking()
                .Include(a => a.Brand)
                .Include(a => a.Category)
                .Where(p => ids.Contains(p.ProductId) && p.Status == 1)
                .ToListAsync();
            return products;
        }
        public async Task<bool> CheckProductByIdAsync(int productId)
        {
            return await context.Products.AnyAsync(a => a.ProductId == productId);
        }
        public async Task<Product?> GetProductByIdAsync(int productId)
        {
            return await context.Products.FindAsync(productId);
        }
        public async Task<List<Product>> GetProductByQuery(string query)
        {
            query = query.Trim().ToLower();

            var products = await context.Products
                .AsNoTracking()
                .Include(a => a.Brand)
                .Include(a => a.Category)
                .Include(p => p.Specifications)
                .Where(p => p.Status == 1 &&
                (
                    EF.Functions.Like(p.Name!.ToLower(), $"%{query}%") ||
                    EF.Functions.Like(p.Description!.ToLower(), $"%{query}%") ||
                    p.Specifications!.Any(s =>
                        EF.Functions.Like(s.SpecName!.ToLower(), $"%{query}%") ||
                        EF.Functions.Like(s.Detail!.ToLower(), $"%{query}%")
                    )
                ))
                .OrderByDescending(a => a.ProductId)
                .ToListAsync();
            
            return products;
        }

        // Repo for Product Images
        // Repo for Product Comments
        public async Task<int?> AddProductCommentAsync(ProductComment model)
        {
            if(model != null)
            {
                context.ProductComments.Add(model);
                await context.SaveChangesAsync();
                return model.CommentId;
            }
            return null;
        }
        // Repo for Product Specifications
    }
}
