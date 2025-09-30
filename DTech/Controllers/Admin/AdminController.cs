using DTech.API.Helper;
using DTech.Application.DTOs.response.admin.admin;
using DTech.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DTech.API.Controllers.Admin
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController(
        IAdminService adminService
    ) : ControllerBase
    {
        [HttpGet("get-admins")]
        public async Task<IActionResult> GetAdmins()
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await adminService.GetAdmins();
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetAdmin(string id)
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await adminService.GetAdminDetailAsync(id);
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateAdmin([FromForm] AdminDetailDto model)
        {
            var (userId, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await adminService.CreateAdminAsync(model, userId);
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateAdmin(string id, [FromForm] AdminDetailDto model)
        {
            var (userId, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await adminService.UpdateAdminAsync(id, model, userId);
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteAdmin(string id)
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await adminService.DeleteAdminAsync(id);
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpGet("get-roles")]
        public async Task<IActionResult> GetRoles()
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var roles = await adminService.GetRolesAsync();
            return Ok(roles);
        }
    }
}
