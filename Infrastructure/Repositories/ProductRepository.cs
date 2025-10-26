using DTech.Domain.Entities;
using DTech.Domain.Enums;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using static System.Net.Mime.MediaTypeNames;

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
                .Where(a => a.Category!.Name != "Laptop" && a.Category!.Name != "Smart Phone" && a.Category!.Name != "Tablet" && a.Status == StatusEnums.Available)
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
                    && a.Status == StatusEnums.Available)
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
                .Where(a => a.Discount != null && a.Discount > 0 && a.Status == StatusEnums.Available)
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
                .Where(a => a.Discount != null && a.Discount > 0 && a.BrandId == brandId && a.Status == StatusEnums.Available)
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
                .Where(p => p.CategoryId != null && id.Contains(p.CategoryId.Value) && p.Status == StatusEnums.Available)
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
                .FirstOrDefaultAsync(a => a.Slug == slug && a.Status == StatusEnums.Available);

            if (product != null)
            {
                product.ProductColors = await context.ProductColors
                    .Where(c => c.ProductId == product.ProductId)
                    .ToListAsync();

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

        public IQueryable<Product> GetAllProductsQuery()
        {
            return context.Products
                .AsNoTracking()
                .Include(p => p.Brand)
                .Include(p => p.Category)
                .Where(p => p.Status == StatusEnums.Available);
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
                .Where(a => a.BrandId == brandId && a.ProductId != productId && a.Status == StatusEnums.Available)
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
                .Where(a => a.CategoryId == categoryId && a.BrandId == brandId && a.Status == StatusEnums.Available)
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
                .Where(p => ids.Contains(p.ProductId) && p.Status == StatusEnums.Available)
                .ToListAsync();
            return products;
        }
        public async Task<bool> CheckProductByIdAsync(int productId)
        {
            return await context.Products.AnyAsync(a => a.ProductId == productId);
        }
        public async Task<Product?> GetProductByIdAsync(int? productId)
        {
            if (productId == null)
                return null;

            var product = await context.Products
                .AsNoTracking()
                .Include(a => a.Brand)
                .Include(a => a.Category)
                .Include(p => p.Specifications)
                .Include(p => p.ProductImages)
                .Include(p => p.ProductColors).ThenInclude(pc => pc.ProductModel)
                .FirstOrDefaultAsync(a => a.ProductId == productId);

            return product;
        }
        public async Task<List<Product>> GetProductByQuery(string query)
        {
            query = query.Trim().ToLower();

            var products = await context.Products
                .AsNoTracking()
                .Include(a => a.Brand)
                .Include(a => a.Category)
                .Include(p => p.Specifications)
                .Where(p => p.Status == StatusEnums.Available &&
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
        public async Task<List<ProductImage>> GetImageAsync(int productId)
        {
            return await context.ProductImages
                .AsNoTracking()
                .Where(a => a.ProductId == productId)
                .ToListAsync();
        }
        public async Task AddImagesAsync(List<ProductImage> images)
        {
            if (images == null || images.Count == 0)
                return;

            await context.ProductImages.AddRangeAsync(images);
        }
        public async Task DeleteImagesAsync(List<int> imageIds)
        {
            if (imageIds == null || imageIds.Count == 0)
                return;

            var images = await context.ProductImages
                .Where(img => imageIds.Contains(img.ImageId))
                .ToListAsync();

            if (images.Count != 0)
            {
                context.ProductImages.RemoveRange(images);
            }
        }
        public async Task<bool> SaveImagesAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }
        // Repo for Product Comments
        public async Task<int?> AddProductCommentAsync(ProductComment model)
        {
            if (model != null)
            {
                context.ProductComments.Add(model);
                await context.SaveChangesAsync();
                return model.CommentId;
            }
            return null;
        }
        // Repo for Product Specifications
        public async Task<List<Specification>> GetSpecificationAsync(int productId)
        {
            return await context.Specifications
                .AsNoTracking()
                .Where(a => a.ProductId == productId)
                .ToListAsync();
        }
        public async Task AddSpecificationAsync(Specification specs)
        {
            if (specs == null)
                return;

            await context.Specifications.AddAsync(specs);
        }

        public async Task DeleteSpecificationsAsync(List<int> specIds)
        {
            if (specIds == null || specIds.Count == 0)
                return;

            var specs = await context.Specifications
                .Where(spec => specIds.Contains(spec.SpecId))
                .ToListAsync();

            if (specs.Count != 0)
            {
                context.Specifications.RemoveRange(specs);
            }
        }
        public async Task<bool> SaveSpecificationsAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }

        // Repo for Product Color
        public async Task<List<ProductColor>> GetColorAsync(int productId)
        {
            return await context.ProductColors
                .AsNoTracking()
                .Where(a => a.ProductId == productId)
                .ToListAsync();
        }

        public async Task AddColorAsync(ProductColor newColor)
        {
            if (newColor == null)
                return;

            await context.ProductColors.AddAsync(newColor);
        }

        public async Task DeleteColorsAsync(List<int> colorIds)
        {
            if (colorIds == null || colorIds.Count == 0)
                return;

            var colors = await context.ProductColors
                .Where(color => colorIds.Contains(color.ColorId))
                .ToListAsync();

            if(colors.Count != 0)
            {
                context.ProductColors.RemoveRange(colors);
            }
        }
        public async Task<bool> SaveColorsAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }

        // Repo for Product Models
        public async Task<List<ProductModel>> GetModelsAsync(int productId)
        {
            return await context.ProductModels
                .Where(m => m.ProductColor != null && m.ProductColor.ProductId == productId)
                .ToListAsync();
        }
        public async Task AddModelsAsync(List<ProductModel> models)
        {
            if (models == null || models.Count == 0)
                return;
            await context.ProductModels.AddRangeAsync(models);
        }
        public async Task DeleteModelsAsync(List<int> modelIds)
        {
            if (modelIds == null || modelIds.Count == 0)
                return;
            var models = await context.ProductModels
                .Where(model => modelIds.Contains(model.ModelId))
                .ToListAsync();
            if (models.Count != 0)
            {
                context.ProductModels.RemoveRange(models);
            }
        }
        public async Task<bool> SaveModelsAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }
        // For admin

        public async Task<List<Product>?> GetAllProductsAsync()
        {
            return await context.Products
                .AsNoTracking()
                .Where(p => p.Status == StatusEnums.Available)
                .OrderBy(p => p.ProductId)
                .ToListAsync();
        }

        public async Task<bool> CheckIfProductExistsAsync(Product product)
        {
            if (product == null)
                return false;

            if (product.ProductId > 0)
            {
                return await context.Products.AnyAsync(p =>
                    p.Slug == product.Slug &&
                    p.ProductId != product.ProductId);
            }
            else
            {
                return await context.Products.AnyAsync(p =>
                    p.Slug == product.Slug);
            }
        }

        public async Task<(bool Success, string Message)> CreateProductAsync(Product product)
        {
            if (product == null)
                return (false, "Product is null");

            await context.Products.AddAsync(product);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Product created successfully");
            else
                return (false, "Failed to create product");
        }

        public async Task<(bool Success, string Message)> UpdateProductAsync(Product product)
        {
            var existingProduct = await context.Products.FindAsync(product.ProductId);
            if (existingProduct == null)
                return (false, "Product not found");

            existingProduct.Name = product.Name;
            existingProduct.Slug = product.Slug;
            existingProduct.Warranty = product.Warranty;
            existingProduct.StatusProduct = product.StatusProduct;
            existingProduct.InitialCost = product.InitialCost;
            existingProduct.Price = product.Price;
            existingProduct.Discount = product.Discount;
            existingProduct.PriceAfterDiscount = product.PriceAfterDiscount;
            existingProduct.EndDateDiscount = product.EndDateDiscount;
            existingProduct.Views = product.Views;
            existingProduct.DateOfManufacture = product.DateOfManufacture;
            existingProduct.MadeIn = product.MadeIn;
            existingProduct.PromotionalGift = product.PromotionalGift;
            existingProduct.Photo = product.Photo;
            existingProduct.Description = product.Description;
            existingProduct.UpdateDate = DateTime.UtcNow;
            existingProduct.UpdatedBy = product.UpdatedBy;
            existingProduct.Status = product.Status;

            Console.WriteLine($"[DEBUG] product.StatusProduct = '{product.StatusProduct}'");
            Console.WriteLine($"[DEBUG] existingProduct StatusProduct = {existingProduct.StatusProduct}");

            context.Products.Update(existingProduct);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Product updated successfully");
            else
                return (false, "Failed to update product");
        }

        public async Task<(bool Success, string Message)> DeleteProductAsync(int productId)
        {
            var product = await context.Products.FindAsync(productId);
            if (product == null)
                return (false, "Product not found");

            context.Products.Remove(product);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Product deleted successfully");
            else
                return (false, "Failed to delete product");
        }
    }
}
