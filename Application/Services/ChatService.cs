using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;

namespace DTech.Application.Services
{
    public class ChatService(
        IChatRepository chatRepository
    ) : IChatService
    {
        public async Task SaveMessageAsync(string? senderId, string? receiverId, string message)
        {
            try
            {
                await chatRepository.AddChatAsync(new Chat
                {
                    SenderId = senderId,
                    ReceiverId = receiverId,
                    Message = message,
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occurred while saving the chat message: " + ex.Message);
            }
        }
    }
}
