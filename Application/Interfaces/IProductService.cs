using DTech.Application.DTOs;
using DTech.Domain.Entities;

namespace DTech.Application.Interfaces
{
    public interface IProductService
    {
        Task<ProductDto> ProductDetailAsync(string categorySlug, string brandSlug, string slug);

        Task<List<ProductDto>> GetProductsByCategoryAsync(string? categorySlug, string? sortOrder);

        Task<List<ProductDto>> GetProductsByCategoryAndBrandAsync(string? categorySlug, string? brandSlug, string? sortOrder);

        Task<List<ProductDto>> GetRecentlyViewedProductsAsync(string? ids);
    }
}
