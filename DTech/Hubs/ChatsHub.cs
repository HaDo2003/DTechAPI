using DTech.Application.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace DTech.API.Hubs
{
    public class ChatsHub(
        IChatService chatService
    ) : Hub
    {
        public async Task SendMessage(string? receiverId, string message)
        {
            var senderId = Context.UserIdentifier;
            senderId ??= null;
            receiverId ??= "7aede655-1203-45b4-a00e-a0f81a812ecb";

            await chatService.SaveMessageAsync(senderId, receiverId, message);

            await Clients.User(receiverId)
                .SendAsync("ReceiveMessage", senderId, message);
        }
    }
}
