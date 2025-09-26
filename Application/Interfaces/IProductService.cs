using DTech.Application.DTOs.request;
using DTech.Application.DTOs.response;
using DTech.Domain.Entities;

namespace DTech.Application.Interfaces
{
    public interface IProductService
    {
        Task<ProductDto?> ProductDetailAsync(string categorySlug, string brandSlug, string slug);

        Task<List<ProductDto>?> GetProductsByCategoryAsync(string? categorySlug, string? sortOrder);

        Task<List<ProductDto>?> GetProductsByCategoryAndBrandAsync(string? categorySlug, string? brandSlug, string? sortOrder);

        Task<List<ProductDto>> GetRecentlyViewedProductsAsync(string? ids);
        Task<ProductCommentDto> PostCommentAsync(ProductCommentRequestDto model);
        Task<List<ProductDto>> SearchProductsAsync(string query, string sortOrder, string? customerId);
    }
}
