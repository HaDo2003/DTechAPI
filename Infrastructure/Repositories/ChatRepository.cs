using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DTech.Infrastructure.Repositories
{
    public class ChatRepository(
        DTechDbContext context
    ) : IChatRepository
    {
        public async Task AddChatAsync(Chat chat)
        {
            var strategy = context.Database.CreateExecutionStrategy();

            await strategy.ExecuteAsync(async () =>
            {
                context.Chats.Add(chat);
                await context.SaveChangesAsync();
            });
        }

        public async Task<List<Chat>> GetChatsByUserIdAsync(string userId)
        {
            return await context.Chats
                .Where(c => c.SenderId == userId || c.ReceiverId == userId)
                .OrderBy(c => c.Timestamp)
                .ToListAsync();
        }

        public async Task<List<Chat>> GetAdminChatListAsync(string adminId)
        {
            return await context.Chats
                .Where(c => c.ReceiverId == adminId || c.SenderId == adminId)
                .Include(c => c.Sender)
                .Include(c => c.Receiver)
                .OrderByDescending(c => c.Timestamp)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<List<Chat>> GetFullChatAsync(string adminId, string senderId)
        {
            return await context.Chats
                .Where(c => (c.SenderId == adminId && c.ReceiverId == senderId) ||
                            (c.SenderId == senderId && c.ReceiverId == adminId))
                .Include(c => c.Sender)
                .Include(c => c.Receiver)
                .OrderBy(c => c.Timestamp)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
