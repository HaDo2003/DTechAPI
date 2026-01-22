using DTech.Application.DTOs.Response;
using DTech.Application.DTOs.Response.Admin;
using DTech.Application.DTOs.Response.Admin.Chat;

namespace DTech.Application.Interfaces
{
    public interface IChatService
    {
        Task<DateTime> SaveMessageAsync(string? senderId, string? receiverId, string message);
        Task<ChatListDto> GetChatHistoryAsync(string userId);
        Task<IndexResDto<List<AdminChatListDto>>> GetAdminChatListAsync(string adminId);
        Task<IndexResDto<List<FullChatDto>>> GetFullChatAsync(string adminId, string senderId);
    }
}
