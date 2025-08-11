using AutoMapper;
using DTech.Application.DTOs;
using DTech.Application.Interfaces;
using DTech.Domain.Interfaces;

namespace DTech.Application.Services
{
    public class ProductService(
        IBrandRepository brandRepo,
        ICategoryRepository categoryRepo,
        IProductRepository productRepo,
        ICustomerRepository customerRepo,
        IMapper _mapper
        ) : IProductService
    {
        public async Task<ProductDto> ProductDetailAsync(string categorySlug, string brandSlug, string slug)
        {
            try
            {
                var category = await categoryRepo.GetCategoryBySlugAsync(categorySlug)
                    ?? throw new Exception($"Category with slug '{categorySlug}' not found.");

                var brand = await brandRepo.GetBrandBySlugAsync(brandSlug)
                    ?? throw new Exception($"Brand with slug '{brandSlug}' not found.");
                
                var product = await productRepo.GetBySlugAsync(slug, category.CategoryId, brand.BrandId) 
                    ?? throw new Exception($"Product with slug '{slug}' not found in category '{category.Name}' and brand '{brand.Name}'.");
                await productRepo.IncrementProductViewsAsync(product.ProductId);
                var productDto = _mapper.Map<ProductDto>(product);
                return productDto;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while fetching product details.", ex);
            }
        }
    }
}
