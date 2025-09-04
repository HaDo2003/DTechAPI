using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface IProductRepository
    {
        // Repo for products
        Task<List<Product>> GetDiscountedProductsAsync();
        Task<List<Product>> GetDiscountedProductsAsync(int brandId);
        Task<List<Product>> GetAccessoriesAsync();
        Task<List<Product>> GetAccessoriesAsync(int brandId);
        Task<List<Product>> GetProductsByCategoryIdAsync(List<int> categoryIds);
        Task<Product?> GetBySlugAsync(string? slug, int? categoryId, int? brandId);
        Task<bool> IncrementProductViewsAsync(int? productId);
        Task<List<Product>> GetRelatedProductsAsync(int? brandId, int? productId);
        Task<List<Product>> GetByCategoryAndBrandAsync(int? categoryId, int? brandId);

        Task<List<Product>> GetProductsByIdListAsync(List<int> ids);

        // Repo for Product Images
        // Repo for Product Comments
        Task<int?> AddProductCommentAsync(ProductComment model);
        // Repo for Product Specifications
    }
}
