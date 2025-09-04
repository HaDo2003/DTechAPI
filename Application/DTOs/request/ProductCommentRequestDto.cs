namespace DTech.Application.DTOs.request
{
    public class ProductCommentRequestDto
    {
        public int? ProductId { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Detail { get; set; }
        public decimal? Rate { get; set; }
    }
}
