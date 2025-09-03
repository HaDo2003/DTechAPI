namespace DTech.Application.DTOs.response
{
    public class WishlistDto
    {
        public int WishListId { get; set; }
        public int? ProductId { get; set; }
        public virtual ProductDto? Product { get; set; }
    }
}
