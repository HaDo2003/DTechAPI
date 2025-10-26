using Microsoft.AspNetCore.Http;

namespace DTech.Application.DTOs.Response.Admin.Product
{
    public class ProductModelReqDto
    {
        public int? ModelId { get; set; }
        public int ColorId { get; set; }
        public string? ModelName { get; set; }
        public IFormFile? ModelUpload { get; set; }
        
    }
    public class GlbReq
    {
        public List<ProductModelReqDto> Models { get; set; } = [];
    }
}
