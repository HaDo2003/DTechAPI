namespace DTech.Application.DTOs.Request
{
    public class ChatMessageDto
    {
        public string? SenderId { get; set; } = "";
        public string? SenderName { get; set; } = "";
        public string? Message { get; set; } = "";
        public DateTime Timestamp { get; set; }
    }
}
