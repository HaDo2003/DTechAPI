using DTech.Application.DTOs.Response.Admin;
using DTech.Application.DTOs.Response.Admin.Coupon;

namespace DTech.Application.Interfaces
{
    public interface ICouponService
    {
        Task<IndexResDto<List<CouponIndexDto>>> GetCouponsAsync();
        Task<IndexResDto<CouponDetailDto>> GetCouponDetailAsync(int couponId);
        Task<IndexResDto<object?>> CreateCouponAsync(CouponDetailDto model, string? currentUserId);
        Task<IndexResDto<object?>> UpdateCouponAsync(int couponId, CouponDetailDto model, string? currentUserId);
        Task<IndexResDto<object?>> DeleteCouponAsync(int couponId);
    }
}
