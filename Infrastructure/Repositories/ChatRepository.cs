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
    }
}
