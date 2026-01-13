using DTech.Application.DTOs.request;
using DTech.Application.DTOs.response;
using DTech.Application.Interfaces;
using DTech.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VNPAY;
using VNPAY.Models.Exceptions;

namespace DTech.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CheckOutController(
        ICheckOutService checkOutService,
        IVnpayClient vnpayClient
    ) : ControllerBase
    {
        [HttpGet("check-out")]
        public async Task<IActionResult> CheckOut()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var response = await checkOutService.GetCheckOutAsync(userId);
            if (response == null)
                return NotFound(new { Message = "User not found." });

            if (!response.Success)
                return BadRequest(new { response.Message });

            return Ok(response);
        }

        [HttpPost("apply-coupon")]
        public async Task<IActionResult> ApplyCoupon([FromBody] DiscountReqDto model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            if (string.IsNullOrEmpty(model.Code))
                return BadRequest(new { success = false, message = "Please enter a coupon code" });

            OrderSummaryResDto response;
            if (model.IsBuyNow && model.ProductId.HasValue && model.Quantity.HasValue)
            {
                // Handle buy now coupon application
                response = await checkOutService.ApplyCouponBuyNowAsync(
                    model.Code,
                    userId,
                    model.ProductId.Value,
                    model.Quantity.Value
                );
            }
            else
            {
                // Handle normal cart coupon application
                response = await checkOutService.ApplyCouponAsync(model.Code, userId);
            }
            return Ok(response.Success
                    ? response
                    : Ok(new { success = false, message = response.Message }));
        }

        [HttpPost("buy-now")]
        public async Task<IActionResult> BuyNow([FromBody] BuyNowReqDto modelReq)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var response = await checkOutService.BuyNowAsync(userId, modelReq);
            if (response == null)
                return NotFound(new { Message = "User not found." });

            if (!response.Success)
                return BadRequest(new { response.Message });

            return Ok(response);
        }

        [HttpPost("place-order")]
        public async Task<IActionResult> PlaceOrder([FromBody] CheckOutDto model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var response = await checkOutService.PlaceOrderAsync(userId, model);
            if (response == null)
                return NotFound(new { Message = "User not found." });

            if (!response.Success)
                return BadRequest(new { success = false, response.Message });

            return Ok(response);
        }

        [HttpGet("order-success/{orderId}")]
        public async Task<IActionResult> OrderSuccess(string orderId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();
            var response = await checkOutService.GetOrderByIdAsync(orderId, userId);
            if (response == null)
                return NotFound(new { Message = "Order not found." });
            if (!response.Success)
                return BadRequest(new { response.Message });
            return Ok(response);
        }
    }
}
