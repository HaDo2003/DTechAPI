using DTech.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DTech.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController(
        IChatService chatService
    ) : ControllerBase
    {
        [HttpGet("fetch-chat-history")]
        public async Task<IActionResult> FetchChatHistory()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var res = await chatService.GetChatHistoryAsync(userId);
            if (!res.Success)
                return BadRequest(new { res.Message });

            return Ok(res.Chats);
        }
    }
}
