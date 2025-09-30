using DTech.API.Helper;
using DTech.Application.DTOs.Response.Admin.Coupon;
using DTech.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DTech.API.Controllers.Admin
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin, Seller")]
    public class CouponController(
        ICouponService couponService
    ) : ControllerBase
    {
        [HttpGet("get-coupons")]
        public async Task<IActionResult> GetCoupons()
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await couponService.GetCouponsAsync();
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetCoupon(int id)
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await couponService.GetCouponDetailAsync(id);
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateCoupon([FromForm] CouponDetailDto model)
        {
            var (userId, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await couponService.CreateCouponAsync(model, userId);
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateCoupon(int id, [FromForm] CouponDetailDto model)
        {
            var (userId, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await couponService.UpdateCouponAsync(id, model, userId);
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteCoupon(int id)
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await couponService.DeleteCouponAsync(id);
            return ControllerHelper.HandleResponse(response, this);
        }
    }
}
