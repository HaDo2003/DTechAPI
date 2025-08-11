namespace DTech.Application.DTOs
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
