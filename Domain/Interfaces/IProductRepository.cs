using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface IProductRepository
    {
        // Repo for products
        Task<IQueryable<Product>> GetDiscountedProductsAsync();
        Task<IQueryable<Product>> GetDiscountedProductsAsync(int brandId);
        Task<IQueryable<Product>> GetAccessoriesAsync();
        Task<IQueryable<Product>> GetAccessoriesAsync(int brandId);
        Task<IQueryable<Product>> GetProductsByCategoryIdAsync(List<int> categoryIds);
        Task<IQueryable<Product>> GetByCategoryAndBrandAsync(int? categoryId, int? brandId);
        Task<IQueryable<Product>> GetAllProductsQuery();
        Task<Product?> GetBySlugAsync(string? slug, int? categoryId, int? brandId);
        Task<bool> IncrementProductViewsAsync(int? productId);
        Task<List<Product>> GetRelatedProductsAsync(int? brandId, int? productId);
        Task<List<Product>> GetProductsByIdListAsync(List<int> ids);
        Task<bool> CheckProductByIdAsync(int productId);
        Task<Product?> GetProductByIdAsync(int? productId);
        Task<IQueryable<Product>> GetProductByQuery(string query);

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

        // Repo for Product Color
        Task<List<ProductColor>> GetColorAsync(int productId);
        Task AddColorAsync(ProductColor newColor);
        Task DeleteColorsAsync(List<int> colorIds);
        Task<bool> SaveColorsAsync();

        // Repo for Product Models
        Task<List<ProductModel>> GetModelsAsync(int productId);
        Task AddModelsAsync(List<ProductModel> models);
        Task DeleteModelsAsync(List<int> modelIds);
        Task<bool> SaveModelsAsync();

        //For admin
        Task<List<Product>?> GetAllProductsAsync();
        Task<bool> CheckIfProductExistsAsync(Product product);
        Task<(bool Success, string Message)> CreateProductAsync(Product product);
        Task<(bool Success, string Message)> UpdateProductAsync(Product product);
        Task<(bool Success, string Message)> DeleteProductAsync(int productId);
    }
}
