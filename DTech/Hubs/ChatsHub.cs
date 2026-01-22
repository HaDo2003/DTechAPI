using DTech.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace DTech.API.Hubs
{
    [Authorize]
    public class ChatsHub(
        IChatService chatService
    ) : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier ?? "guest";
            var userName = Context.User?.Identity?.Name;
            Console.WriteLine($"User connected - UserIdentifier: {userId}, UserName: {userName}");

            await Clients.Caller.SendAsync("SetUserId", userId);

            await base.OnConnectedAsync();
        }

        public async Task SendMessage(string? receiverId, string message)
        {
            var senderId = Context.UserIdentifier ?? "guest";

            const string defaultAdminId = "906e4bd0-61d0-4acf-8b96-36df1afe104b";
            receiverId ??= defaultAdminId;

            Console.WriteLine($"SendMessage called - SenderId: {senderId}, ReceiverId: {receiverId}");

            var timestamp = await chatService.SaveMessageAsync(senderId, receiverId, message);

            // Send to receiver
            await Clients.User(receiverId)
                .SendAsync("ReceiveMessage", senderId, receiverId, message, timestamp);

            // Send back to sender so they see their own message
            await Clients.Caller
                .SendAsync("ReceiveMessage", senderId, receiverId, message, timestamp);
        }
    }
}
