using DTech.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTech.Domain.Interfaces
{
    public interface IProductRepository
    {
        // Repo for products
        Task<List<Product>> GetDiscountedProductsAsync();
        Task<List<Product>> GetAccessoriesAsync();
        Task<List<Product>> GetProductsByCategoryIdAsync(List<int> categoryIds);
        Task<Product?> GetBySlugAsync(string? slug, int? categoryId, int? brandId);
        Task<bool> IncrementProductViewsAsync(int? productId);

        // Repo for Product Images
        // Repo for Product Comments
        // Repo for Product Specifications
    }
}
