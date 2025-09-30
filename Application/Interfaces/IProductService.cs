using DTech.Application.DTOs.request;
using DTech.Application.DTOs.response;
using DTech.Application.DTOs.response.admin;
using DTech.Application.DTOs.Response.Admin.Product;
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

        // For Admin
        Task<IndexResDto<List<ProductIndexDto>>> GetProductsAsync();
        Task<IndexResDto<ProductDetailDto>> GetProductDetailAsync(int productId);
        Task<IndexResDto<object?>> CreateProductAsync(ProductDetailDto model, string? currentUserId);
        Task<IndexResDto<object?>> UpdateProductAsync(int productId, ProductDetailDto model, string? currentUserId);
        Task<IndexResDto<object?>> DeleteProductAsync(int productId);
    }
}
