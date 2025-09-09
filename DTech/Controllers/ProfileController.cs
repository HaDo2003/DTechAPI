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
        public async Task<IActionResult> FetchProfileAsync()
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
        public async Task<IActionResult> UpdateProfileAsync([FromForm] UpdateProfileDto model)
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
        public async Task<IActionResult> ChangePasswordAsync([FromBody] ChangePasswordDto model)
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
        public async Task<IActionResult> AddAddressAsync([FromBody] AddAddressDto model)
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
        public async Task<IActionResult> EditAddressAsync([FromBody] EditAddressDto model)
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
        public async Task<IActionResult> DeleteAddressAsync(int addressId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var response = await customerService.DeleteAddressAsync(userId, addressId);
            if (!response.Success)
                return BadRequest(new { response.Message });

            return Ok(new { Message = "Delete Address successfully." });
        }
    }
}
