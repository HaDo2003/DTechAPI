using DTech.Application.DTOs.Response;
using DTech.Application.DTOs.Response.Admin;
using DTech.Application.DTOs.Response.Admin.Chat;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using System;

namespace DTech.Application.Services
{
    public class ChatService(
        IChatRepository chatRepository
    ) : IChatService
    {
        public async Task<DateTime> SaveMessageAsync(string? senderId, string? receiverId, string message)
        {
            try
            {
                var timestamp = DateTime.UtcNow;
                await chatRepository.AddChatAsync(new Chat
                {
                    SenderId = senderId,
                    ReceiverId = receiverId,
                    Message = message,
                    Timestamp = timestamp
                });
                return timestamp;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occurred while saving the chat message: " + ex.Message);
                return DateTime.UtcNow;
            }
        }

        public async Task<ChatListDto> GetChatHistoryAsync(string userId)
        {
            var chats = await chatRepository.GetChatsByUserIdAsync(userId);
            if (chats == null || chats.Count == 0)
                return new ChatListDto { Success = false, Message = "No chat history found." };

            var chatDto = chats.Select(c => new ChatDto
            {
                Id = c.Id,
                SenderId = c.SenderId,
                ReceiverId = c.ReceiverId,
                Message = c.Message,
                Timestamp = c.Timestamp
            }).ToList();

            return new ChatListDto { Success = true, Chats = chatDto };
        }
        public async Task<IndexResDto<List<AdminChatListDto>>> GetAdminChatListAsync(string adminId)
        {
            var adminChats = await chatRepository.GetAdminChatListAsync(adminId);

            var adminChatDto = adminChats
                .GroupBy(c => c.SenderId == adminId ? c.ReceiverId : c.SenderId)
                .Select(g =>
                {
                    var latest = g.First();
                    var otherUser = latest.SenderId == adminId ? latest.Receiver : latest.Sender;
                    if (otherUser == null)
                    {
                        return null;
                    }

                    return new AdminChatListDto
                    {
                        SenderId = otherUser.Id,
                        SenderName = otherUser.FullName,
                        Message = latest.Message,
                        Timestamp = latest.Timestamp,
                        AvatarUrl = otherUser.Image
                    };
                })
                .Where(c => c != null)
                .OrderByDescending(c => c!.Timestamp)
                .ToList()!
                .ConvertAll(c => c!);

            return new IndexResDto<List<AdminChatListDto>>
            {
                Success = adminChatDto.Count > 0,
                Data = adminChatDto,
                Message = adminChatDto.Count > 0 ? null : "No admin chat found."
            };
        }

        public async Task<IndexResDto<List<FullChatDto>>> GetFullChatAsync(string adminId, string senderId)
        {
            var chats = await chatRepository.GetFullChatAsync(adminId, senderId);

            var otherUser = chats.FirstOrDefault(c => c.SenderId == senderId || c.ReceiverId == senderId)
                ?.SenderId == adminId ? chats.First().Receiver : chats.First().Sender;

            if (otherUser == null) 
            {
                return new IndexResDto<List<FullChatDto>>
                {
                    Success = false,
                    Message = "User not found."
                };
            }

            var fullChatDto = new FullChatDto
            {
                SenderId = otherUser.Id,
                SenderName = otherUser.FullName,
                SenderImageUrl = otherUser.Image,
                Messages = [.. chats.Select(c => new ChatDto
                {
                    Id = c.Id,
                    SenderId = c.SenderId,
                    ReceiverId = c.ReceiverId,
                    Message = c.Message,
                    Timestamp = c.Timestamp
                })]
            };

            return new IndexResDto<List<FullChatDto>>
            {
                Success = true,
                Data = [fullChatDto]
            };
        }
    }
}
