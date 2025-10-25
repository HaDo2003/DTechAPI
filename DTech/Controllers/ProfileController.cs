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
    public class ProfileController(
        ICustomerService customerService
    ) : ControllerBase
    {
        [HttpGet("me")]
        public async Task<IActionResult> FetchProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var response = await customerService.GetCustomer(userId);
            if (response == null)
                return NotFound(new { Message = "User not found." });

            if (!response.Success)
                return BadRequest(new { response.Message });

            return Ok(response);
        }

        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromForm] UpdateProfileDto model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var response = await customerService.UpdateCustomerProfile(userId, model);
            if (!response.Success)
                return BadRequest(new { response.Message });

            return Ok(new { Message = "Profile updated successfully." });
        }

        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var response = await customerService.UpdateNewPasswordAsync(userId, model);
            if (!response.Success)
                return BadRequest(new {response.Message});

            return Ok(new { Message = "Change Password successfully." });
        }

        [HttpPost("add-new-address")]
        public async Task<IActionResult> AddAddress([FromBody] AddAddressDto model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var response = await customerService.AddAddressAsync(userId, model);
            if (!response.Success)
                return BadRequest(new { response.Message });

            return Ok(new 
            { 
                Message = "Add Address successfully.",
                response.AddressId
            });
        }

        [HttpPut("edit-address")]
        public async Task<IActionResult> EditAddress([FromBody] EditAddressDto model)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var response = await customerService.EditAddressAsync(userId, model);
            if (!response.Success)
                return BadRequest(new { response.Message });

            return Ok(new { Message = "Edit Address successfully." });
        }

        [HttpDelete("delete-address/{addressId}")]
        public async Task<IActionResult> DeleteAddress(int addressId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var response = await customerService.DeleteAddressAsync(userId, addressId);
            if (!response.Success)
                return BadRequest(new { response.Message });

            return Ok(new { Message = "Delete Address successfully." });
        }

        [HttpPut("switch-default-address/{addressId}")]
        public async Task<IActionResult> SwitchDefault(int addressId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var response = await customerService.SwitchDefaultAsync(userId, addressId);
            if (!response.Success)
                return BadRequest(new { response.Message });

            return Ok(new { Message = "Change default address successfully." });
        }

        [HttpGet("get-order-detail/{orderId}")]
        public async Task<IActionResult> GetOrderDetail(string orderId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var response = await customerService.GetOrderDetailAsync(userId, orderId);
            if (response == null)
                return NotFound(new { Message = "Order not found." });

            if (!response.Success)
                return BadRequest(new { response.Message });

            return Ok(response);
        }

        [HttpPut("cancel-order/{orderId}")]
        public async Task<IActionResult> CancelOrder(string orderId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var response = await customerService.CancelOrderAsync(userId, orderId);
            if (response == null)
                return NotFound(new { Message = "Order not found." });

            if (!response.Success)
                return BadRequest(new { response.Message });

            return Ok(response);
        }

        [HttpGet("get-wishlists")]
        public async Task<IActionResult> GetWishlists()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var response = await customerService.GetWishlistAsync(userId);
            if (!response.Success)
                return BadRequest(new { response.Message });

            return Ok(response.Data);
        }

        [HttpPost("add-wishlist/{productId}")]
        public async Task<IActionResult> AddWishlist(int productId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var response = await customerService.AddProductToWishlistAsync(userId, productId);
            if (!response.Success)
                return BadRequest(new { response.Message });

            return Ok(response);
        }

        [HttpDelete("remove-wishlist/{productId}")]
        public async Task<IActionResult> RemoveWishlist(int productId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var response = await customerService.RemoveProductFromWishlistAsync(userId, productId);
            if (!response.Success)
                return BadRequest(new { response.Message });

            return Ok(response);
        }
    }
}
