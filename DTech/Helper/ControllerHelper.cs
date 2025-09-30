using DTech.Application.DTOs.response.admin;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DTech.API.Helper
{
    public static class ControllerHelper
    {
        public static string? GetCurrentUserId(ClaimsPrincipal user) =>
            user.FindFirstValue(ClaimTypes.NameIdentifier);

        public static (string? userId, IActionResult? result) HandleUnauthorized(ClaimsPrincipal user, ControllerBase controller)
        {
            var userId = GetCurrentUserId(user);
            if (string.IsNullOrEmpty(userId))
            {
                return (null, controller.Unauthorized());
            }
            return (userId, null);
        }

        public static IActionResult HandleResponse<T>(IndexResDto<T>? response, ControllerBase controller)
        {
            if (response == null)
                return controller.NotFound(new { Message = "User not found." });

            if (!response.Success)
                return controller.BadRequest(new { response.Message });

            return controller.Ok(response.Data ?? (object)response);
        }
    }
}
