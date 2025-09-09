using DTech.Application.DTOs.request;
using DTech.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DTech.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CartController(
        ICartService cartService
    ) : ControllerBase
    {
        [HttpPost("add-to-cart")]
        public async Task<IActionResult> AddToCart([FromBody] CartProductDto model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var res = await cartService.AddToCartAsync(userId, model);
            if (!res.Success)
                return BadRequest(new { res.Message });

            return Ok(new { Message = "Added to cart" });
        }

        [HttpGet("get-cart")]
        public async Task<IActionResult> GetCart()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var res = await cartService.GetCartAsync(userId);
            if (!res.Success)
                return BadRequest(new { res.Message });

            return Ok(res);
        }

        [HttpPut("update-quantity/{id}")]
        public async Task<IActionResult> UpdateQuantity(int id, [FromBody] UpdateCartRequestDto request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await cartService.UpdateQuantityAsync(userId, id, request.Change);
            if (!result.Success)
                return BadRequest(new { result.Message });

            return Ok(result);
        }
    }
}
