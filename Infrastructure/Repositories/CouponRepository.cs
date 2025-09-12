using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DTech.Infrastructure.Repositories
{
    public class CouponRepository(DTechDbContext context) : ICouponRepository
    {
        public async Task<bool> CheckIsUsedAsync(string customerId, int CouponId)
        {
            return await context.CouponUseds
                .AnyAsync(c => c.CouponId == CouponId && c.UserId == customerId);
        }

        public async Task<Coupon?> GetCouponByCode(string code)
        {
            return await context.Coupons.FirstOrDefaultAsync(c => c.Code == code);
        }
        public async Task<bool> UseCodeAsync(string reductionCode, string customerId)
        {
            try
            {
                var coupon = await context.Coupons.FirstOrDefaultAsync(c => c.Code == reductionCode);
                if (coupon == null || string.IsNullOrEmpty(customerId))
                {
                    return false;
                }

                var customerCoupon = new CouponUsed
                {
                    CouponId = coupon.CouponId,
                    UserId = customerId,
                };

                await context.CouponUseds.AddAsync(customerCoupon);
                await context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }
    }
}
