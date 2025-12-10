namespace DTech.Application.DTOs.Response
{
    public class ChatListDto
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public List<ChatDto>? Chats { get; set; }
    }

    public class ChatDto
    {
        public int? Id { get; set; }
        public string? SenderId { get; set; }
        public string? ReceiverId { get; set; }
        public string? Message { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
