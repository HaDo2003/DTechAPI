using Microsoft.AspNetCore.Http;

namespace DTech.Application.DTOs.response
{
    public class ProductImageDto
    {
        public int ImageId { get; set; }
        public string? Image { get; set; }
        public IFormFile? ImageUpload { get; set; }
        public int? ColorId { get; set; }
    }
}
