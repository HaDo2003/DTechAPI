namespace DTech.Application.DTOs.response
{
    public class ProductCommentDto
    {
        public int CommentId { get; set; }
        public string? Name { get; set; }

        public string? Email { get; set; }

        public string? Detail { get; set; }

        public DateTime? CmtDate { get; set; }

        public decimal? Rate { get; set; }
    }
}
