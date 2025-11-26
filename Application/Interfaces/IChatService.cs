namespace DTech.Application.Interfaces
{
    public interface IChatService
    {
        Task SaveMessageAsync(string? senderId, string? receiverId, string message);
    }
}
