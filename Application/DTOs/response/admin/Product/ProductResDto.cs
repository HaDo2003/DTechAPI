using DTech.Application.DTOs.response;

namespace DTech.Application.DTOs.Response.Admin.Product
{
    public class ProductResDto
    {
        public ProductDetailDto? ProductInfor { get; set; }
        public List<ProductColorDto>? ProductColors { get; set; } = [];
        public List<SpecificationDto>? Specifications { get; set; } = [];
        public List<ProductImageDto>? ProductImages { get; set; } = [];
        public List<ProductModelDto>? ProductModels { get; set; } = [];
    }
}
