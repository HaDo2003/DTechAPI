using DTech.Application.Interfaces;
using DTech.Application.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DTech.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController(
        IAdminService adminService
    ) : ControllerBase
    {
        [HttpGet("get-admin")]
        public async Task<IActionResult> GetAdminAsync()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var response = await adminService.GetAdmin(userId);
            if (response == null)
                return NotFound(new { Message = "User not found." });

            if (!response.Success)
                return BadRequest(new { response.Message });

            return Ok(response);
        }
    }
}
