namespace DTech.Application.DTOs.response
{
    public class AdminResDto : MessageResponse
    {
        public string? Avatar { get; set; }
        public string? UserName { get; set; }
        public DateTime? CreateDate { get; set; }
    }
}
