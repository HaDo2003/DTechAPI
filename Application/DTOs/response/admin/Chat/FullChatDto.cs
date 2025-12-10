namespace DTech.Application.DTOs.Response.Admin.Chat
{
    public class FullChatDto
    {
        public string? SenderId { get; set; }
        public string? SenderName { get; set; }
        public string? SenderImageUrl { get; set; }
        public List<ChatDto>? Messages { get; set; }
    }
}
