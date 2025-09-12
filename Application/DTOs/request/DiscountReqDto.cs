namespace DTech.Application.DTOs.request
{
    public class DiscountReqDto
    {
        public string? Code { get; set; }
        public bool IsBuyNow { get; set; } = false; // NEW

        // For buy now
        public int? ProductId { get; set; } 
        public int? Quantity { get; set; }
    }
}
