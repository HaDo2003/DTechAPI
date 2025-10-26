using Microsoft.AspNetCore.Http;

namespace DTech.Application.DTOs.Response
{
    public class ProductModelDto
    {
        public int? ModelId { get; set; }
        public int ColorId { get; set; }
        public string? ModelName { get; set; }
        public string? ModelUrl { get; set; }
        public IFormFile? ModelUpload { get; set; }
    }
}
