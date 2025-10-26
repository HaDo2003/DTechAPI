using Microsoft.AspNetCore.Http;

namespace DTech.Application.DTOs.Response.Admin.Product
{
    public class ProductImageReqDto
    {
        // Existing images
        public List<int>? ImageIds { get; set; }
        public List<IFormFile>? ImageUploads { get; set; }
        public List<int>? ColorIds { get; set; }

        // New images
        public List<IFormFile>? NewUploads { get; set; }
        public List<int>? NewColorIds { get; set; }
    }
}
