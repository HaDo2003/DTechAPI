using DTech.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DTech.API.Controllers.Admin
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin,Seller")]
    public class DashboardController(
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

        [HttpGet("fetch-dashboard")]
        public async Task<IActionResult> FetchDashboardAsync()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();
            var response = await adminService.FetchDashboardData();
            if (response == null)
                return NotFound(new { Message = "Fail to fecth dashboard" });
            if (!response.Success)
                return BadRequest(new { response.Message });
            return Ok(response);
        }
    }
}
