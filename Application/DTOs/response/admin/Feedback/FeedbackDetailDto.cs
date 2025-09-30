namespace DTech.Application.DTOs.Response.Admin.Feedback
{
    public class FeedbackDetailDto
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Message { get; set; }
        public DateTime? Fbdate { get; set; }
    }
}
