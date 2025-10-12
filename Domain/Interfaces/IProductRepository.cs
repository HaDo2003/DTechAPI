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
        IQueryable<Product> GetAllProductsQuery();
        Task<Product?> GetBySlugAsync(string? slug, int? categoryId, int? brandId);
        Task<bool> IncrementProductViewsAsync(int? productId);
        Task<List<Product>> GetRelatedProductsAsync(int? brandId, int? productId);
        Task<List<Product>> GetByCategoryAndBrandAsync(int? categoryId, int? brandId);
        Task<List<Product>> GetProductsByIdListAsync(List<int> ids);
        Task<bool> CheckProductByIdAsync(int productId);
        Task<Product?> GetProductByIdAsync(int? productId);
        Task<List<Product>> GetProductByQuery(string query);

        // Repo for Product Images
        Task<List<ProductImage>> GetImageAsync(int productId);
        Task AddImagesAsync(List<ProductImage> images);
        Task DeleteImagesAsync(List<int> imageIds);
        Task<bool> SaveImagesAsync();

        // Repo for Product Comments
        Task<int?> AddProductCommentAsync(ProductComment model);

        // Repo for Product Specifications
        Task<List<Specification>> GetSpecificationAsync(int productId);
        Task AddSpecificationAsync(Specification spec);
        Task DeleteSpecificationsAsync(List<int> specIds);
        Task<bool> SaveSpecificationsAsync();

        //For admin
        Task<List<Product>?> GetAllProductsAsync();
        Task<bool> CheckIfProductExistsAsync(Product product);
        Task<(bool Success, string Message)> CreateProductAsync(Product product);
        Task<(bool Success, string Message)> UpdateProductAsync(Product product);
        Task<(bool Success, string Message)> DeleteProductAsync(int productId);
    }
}
