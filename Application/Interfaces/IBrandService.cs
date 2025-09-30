using DTech.Application.DTOs.response.admin;
using DTech.Application.DTOs.Response.Admin.Brand;

namespace DTech.Application.Interfaces
{
    public interface IBrandService
    {
        Task<IndexResDto<List<BrandIndexDto>>> GetBrands();
        Task<IndexResDto<BrandDetailDto>> GetBrandDetailAsync(int brandId);
        Task<IndexResDto<object?>> CreateBrandAsync(BrandDetailDto model, string? currentUserId);
        Task<IndexResDto<object?>> UpdateBrandAsync(int brandId, BrandDetailDto model, string? currentUserId);
        Task<IndexResDto<object?>> DeleteBrandAsync(int brandId);
    }
}
