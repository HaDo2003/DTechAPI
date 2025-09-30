using DTech.Domain.Entities;
using DTech.Domain.Enums;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;

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
        public async Task<List<Coupon>?> GetAllCouponsAsync()
        {
            return await context.Coupons
                .AsNoTracking()
                .Where(c => c.Status == StatusEnums.Available)
                .OrderBy(c => c.CouponId)
                .ToListAsync();
        }

        public async Task<Coupon?> GetCouponByIdAsync(int couponId)
        {
            if (couponId <= 0)
                return null;

            return await context.Coupons.FindAsync(couponId);
        }

        public async Task<bool> CheckIfCouponExistsAsync(Coupon coupon)
        {
            if (coupon == null)
                return false;

            if (coupon.CouponId > 0)
            {
                return await context.Coupons.AnyAsync(c =>
                    c.Slug == coupon.Slug &&
                    c.CouponId != coupon.CouponId);
            }
            else
            {
                return await context.Coupons.AnyAsync(c =>
                    c.Slug == coupon.Slug);
            }
        }

        public async Task<(bool Success, string Message)> CreateCouponAsync(Coupon coupon)
        {
            if (coupon == null)
                return (false, "Coupon is null");

            await context.Coupons.AddAsync(coupon);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Coupon created successfully");
            else
                return (false, "Failed to create coupon");
        }

        public async Task<(bool Success, string Message)> UpdateCouponAsync(Coupon coupon)
        {
            var existingCoupon = await context.Coupons.FindAsync(coupon.CouponId);
            if (existingCoupon == null)
                return (false, "Coupon not found");

            existingCoupon.Name = coupon.Name;
            existingCoupon.Slug = coupon.Slug;
            existingCoupon.Code = coupon.Code;
            existingCoupon.DiscountType = coupon.DiscountType;
            existingCoupon.Discount = coupon.Discount;
            existingCoupon.MaxDiscount = coupon.MaxDiscount;
            existingCoupon.Condition = coupon.Condition;
            existingCoupon.Detail = coupon.Detail;
            existingCoupon.EndDate = coupon.EndDate;
            existingCoupon.Status = coupon.Status;
            existingCoupon.UpdateDate = DateTime.UtcNow;
            existingCoupon.UpdatedBy = coupon.UpdatedBy;

            context.Coupons.Update(existingCoupon);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Coupon updated successfully");
            else
                return (false, "Failed to update coupon");
        }

        public async Task<(bool Success, string Message)> DeleteCouponAsync(int couponId)
        {
            var coupon = await context.Coupons.FindAsync(couponId);
            if (coupon == null)
                return (false, "Coupon not found");

            context.Coupons.Remove(coupon);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Coupon deleted successfully");
            else
                return (false, "Failed to delete coupon");
        }
    }
}
