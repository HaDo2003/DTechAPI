using DTech.Application.DTOs.response;
using Microsoft.AspNetCore.Http;

namespace DTech.Application.DTOs.Response.Admin.Product
{
    public class ProductReqDto
    {
        public ProductDetailDto ProductInfor { get; set; } = new();
        public List<SpecificationDto>? Specifications { get; set; } = [];
        public List<ProductColorDto>? ProductColors { get; set; } = [];
        public List<int>? ExistingImageIds { get; set; } = new();
        public List<IFormFile>? ExistingImageUploads { get; set; } = new();
        public List<IFormFile>? NewImageUploads { get; set; } = new();
    }
}
