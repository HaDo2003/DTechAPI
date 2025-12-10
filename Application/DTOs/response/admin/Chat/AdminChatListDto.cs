namespace DTech.Application.DTOs.Response.Admin.Chat
{
    public class AdminChatListDto
    {
        public string? SenderId { get; set; }
        public string? SenderName { get; set; } = null;
        public string? Message { get; set; } = null;
        public DateTime Timestamp { get; set; }
        public string? AvatarUrl { get; set; } = null;
    }
}
