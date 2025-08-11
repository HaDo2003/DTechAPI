using DTech.Application.DTOs;

namespace DTech.Application.Interfaces
{
    public interface IProductService
    {
        Task<ProductDto> ProductDetailAsync(string categorySlug, string brandSlug, string slug);
    }
}
