using DTech.Application.DTOs.Response;

namespace DTech.Application.DTOs.request
{
    public class BuyNowReqDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public int ColorId { get; set; }
    }
}
