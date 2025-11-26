using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface IChatRepository
    {
        Task AddChatAsync(Chat chat);
    }
}
