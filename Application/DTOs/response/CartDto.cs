namespace DTech.Application.DTOs.response
{
    public class CartDto : MessageResponse
    {
        public int? CartId { get; set; }
        public string? CustomerId { get; set; }
        public virtual ICollection<CartProductDto>? CartProducts { get; set; } = [];
    }
}
