using DTech.API.Helper;
using DTech.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DTech.API.Controllers.Admin
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class ChatController(
        IChatService chatService
    ) : ControllerBase
    {
        [HttpGet("admin/chat-list")]
        public async Task<IActionResult> GetChatList()
        {
            var (adminId, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;
            if (adminId == null)
                return Unauthorized();

            var response = await chatService.GetAdminChatListAsync(adminId);
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpGet("admin/full-chat/{senderId}")]
        public async Task<IActionResult> GetFullChat(string senderId)
        {
            var (adminId, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;
            if (adminId == null)
                return Unauthorized();

            var response = await chatService.GetFullChatAsync(adminId, senderId);
            return ControllerHelper.HandleResponse(response, this);
        }
    }
}
