using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface ICouponRepository
    {
        Task<bool> CheckIsUsedAsync(string customerId, int CouponId);
        Task<Coupon?> GetCouponByCode(string code);
        Task<bool> UseCodeAsync(string reductionCode, string customerId);
    }
}
