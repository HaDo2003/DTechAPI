using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface ICouponRepository
    {
        Task<bool> CheckIsUsedAsync(string customerId, int CouponId);
        Task<Coupon?> GetCouponByCode(string code);
        Task<bool> UseCodeAsync(string reductionCode, string customerId);
        Task<List<Coupon>?> GetAllCouponsAsync();
        Task<Coupon?> GetCouponByIdAsync(int couponId);
        Task<bool> CheckIfCouponExistsAsync(Coupon coupon);
        Task<(bool Success, string Message)> CreateCouponAsync(Coupon coupon);
        Task<(bool Success, string Message)> UpdateCouponAsync(Coupon coupon);
        Task<(bool Success, string Message)> DeleteCouponAsync(int couponId);
    }
}
