using DTech.Application.DTOs.request;
using DTech.Application.DTOs.response;
using DTech.Application.DTOs.Response;
using DTech.Application.DTOs.Response.Admin;
using DTech.Application.DTOs.Response.Admin.Product;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DTech.Application.Interfaces
{
    public interface IProductService
    {
        Task<ProductDto?> ProductDetailAsync(string categorySlug, string brandSlug, string slug);

        Task<List<ProductDto>?> GetProductsByCategoryAsync(string? categorySlug, string? sortOrder);

        Task<List<ProductDto>?> GetProductsByCategoryAndBrandAsync(string? categorySlug, string? brandSlug, string? sortOrder);
        Task<PaginatedProductResDto?> GetAllProductsAsync(int page, int pageSize, string? sortOrder);
        Task<List<ProductDto>> GetRecentlyViewedProductsAsync(string? ids);
        Task<ProductCommentDto> PostCommentAsync(ProductCommentRequestDto model);
        Task<List<ProductDto>> SearchProductsAsync(string query, string sortOrder, string? customerId);

        // For Admin
        Task<IndexResDto<List<ProductIndexDto>>> GetProductsAsync();
        Task<IndexResDto<ProductResDto>> GetProductDetailAsync(int productId);
        Task<List<SelectResDto>> GetCategoriesAsync();
        Task<List<SelectResDto>> GetBrandsAsync();
        Task<IndexResDto<object?>> CreateProductAsync(ProductDetailDto? model, string? currentUserId);
        Task<IndexResDto<object?>> UpdateProductAsync(int productId, ProductDetailDto model, string? currentUserId);
        Task<IndexResDto<object?>> UpdateProductSpecificationAsync(int productId, List<SpecificationDto> model, string? currentUserId);
        Task<IndexResDto<object?>> UpdateProductImageAsync(int productId, List<ProductImageDto> model, string? currentUserId);
        Task<IndexResDto<object?>> DeleteProductAsync(int productId);

        Task<IndexResDto<object?>> UploadGlbAsync(IFormFile file);
    }
}
