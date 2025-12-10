using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface IChatRepository
    {
        Task AddChatAsync(Chat chat);
        Task<List<Chat>> GetChatsByUserIdAsync(string userId);
        Task<List<Chat>> GetAdminChatListAsync(string adminId);
        Task<List<Chat>> GetFullChatAsync(string adminId, string senderId);
    }
}
