using DTech.Application.DTOs.response.admin;
using DTech.Application.DTOs.Response.Admin.Coupon;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;

namespace DTech.Application.Services
{
    public class CouponService(
        IAdminRepository adminRepo,
        ICouponRepository couponRepo
    ) : ICouponService
    {
        public async Task<IndexResDto<List<CouponIndexDto>>> GetCouponsAsync()
        {
            var coupons = await couponRepo.GetAllCouponsAsync();
            if (coupons == null || coupons.Count == 0)
            {
                return new IndexResDto<List<CouponIndexDto>>
                {
                    Success = false,
                    Message = "No coupon found"
                };
            }

            var couponDtos = coupons.Select(c => new CouponIndexDto
            {
                Name = c.Name,
                Code = c.Code,
                DiscountType = c.DiscountType,
                Discount = c.Discount,
                Condition = c.Condition,
                Detail = c.Detail
            }).ToList();

            return new IndexResDto<List<CouponIndexDto>>
            {
                Success = true,
                Data = couponDtos
            };
        }

        public async Task<IndexResDto<CouponDetailDto>> GetCouponDetailAsync(int couponId)
        {
            var coupon = await couponRepo.GetCouponByIdAsync(couponId);
            if (coupon == null)
            {
                return new IndexResDto<CouponDetailDto>
                {
                    Success = false,
                    Message = "Coupon not found"
                };
            }

            var couponDetail = new CouponDetailDto
            {
                Name = coupon.Name,
                Slug = coupon.Slug,
                Code = coupon.Code,
                DiscountType = coupon.DiscountType,
                Discount = coupon.Discount,
                MaxDiscount = coupon.MaxDiscount,
                Condition = coupon.Condition,
                Detail = coupon.Detail,
                Status = coupon.Status,
                EndDate = coupon.EndDate,
                CreateDate = coupon.CreateDate,
                CreatedBy = coupon.CreatedBy,
                UpdateDate = coupon.UpdateDate,
                UpdatedBy = coupon.UpdatedBy
            };

            return new IndexResDto<CouponDetailDto>
            {
                Success = true,
                Data = couponDetail
            };
        }

        public async Task<IndexResDto<object?>> CreateCouponAsync(CouponDetailDto model, string? currentUserId)
        {
            try
            {
                Coupon coupon = new()
                {
                    Name = model.Name,
                    Code = model.Code,
                    DiscountType = model.DiscountType,
                    Discount = model.Discount,
                    Condition = model.Condition,
                    MaxDiscount = model.MaxDiscount,
                    Detail = model.Detail,
                    Status = model.Status,
                    EndDate = model.EndDate,
                    CreateDate = DateTime.UtcNow,
                    CreatedBy = await adminRepo.GetAdminFullNameAsync(currentUserId),
                };

                coupon.Slug = coupon.Name?.ToLower().Replace(" ", "-").Replace("/", "-");

                var existingCoupon = await couponRepo.CheckIfCouponExistsAsync(coupon);
                if (existingCoupon)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = "Coupon with same name exists",
                        Data = null
                    };
                }

                var (Success, Message) = await couponRepo.CreateCouponAsync(coupon);

                if (!Success)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = Message,
                        Data = null
                    };
                }

                return new IndexResDto<object?>
                {
                    Success = true,
                    Message = "Coupon created successfully",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new IndexResDto<object?>
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<IndexResDto<object?>> UpdateCouponAsync(int couponId, CouponDetailDto model, string? currentUserId)
        {
            try
            {
                Coupon coupon = new()
                {
                    CouponId = couponId,
                    Name = model.Name,
                    Code = model.Code,
                    DiscountType = model.DiscountType,
                    Discount = model.Discount,
                    MaxDiscount = model.MaxDiscount,
                    Condition = model.Condition,
                    Detail = model.Detail,
                    Status = model.Status,
                    EndDate = model.EndDate,
                    UpdateDate = DateTime.UtcNow,
                    UpdatedBy = await adminRepo.GetAdminFullNameAsync(currentUserId),
                };

                string newSlug = model.Name?.ToLower().Replace(" ", "-").Replace("/", "-") ?? string.Empty;
                coupon.Slug = newSlug;

                var existingCoupon = await couponRepo.CheckIfCouponExistsAsync(coupon);
                if (existingCoupon)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = "Coupon with the same name already exists",
                        Data = null
                    };
                }

                var (Success, Message) = await couponRepo.UpdateCouponAsync(coupon);
                if (!Success)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = Message,
                        Data = null
                    };
                }
                return new IndexResDto<object?>
                {
                    Success = true,
                    Message = "Coupon updated successfully",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new IndexResDto<object?>
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<IndexResDto<object?>> DeleteCouponAsync(int couponId)
        {
            try
            {
                var (Success, Message) = await couponRepo.DeleteCouponAsync(couponId);
                if (!Success)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = Message,
                        Data = null
                    };
                }
                return new IndexResDto<object?>
                {
                    Success = true,
                    Message = "Coupon deleted successfully",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new IndexResDto<object?>
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}",
                    Data = null
                };
            }
        }
    }

}
