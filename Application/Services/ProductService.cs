using AutoMapper;
using DTech.Application.DTOs;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
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
        //Get details of a product by its slug, category slug, and brand slug
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

                var relatedProducts = await productRepo.GetRelatedProductsAsync(product.ProductId, brand.BrandId);

                await productRepo.IncrementProductViewsAsync(product.ProductId);

                var productDto = _mapper.Map<ProductDto>(product);
                productDto.RelatedProducts = _mapper.Map<List<RelatedProductDto>>(relatedProducts);

                return productDto;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while fetching product details.", ex);
            }
        }

        //Get products by category slug and sort order
        public async Task<List<ProductDto>> GetProductsByCategoryAsync(string? categorySlug, string? sortOrder)
        {
            try
            {
                List<Product> products;
                switch (categorySlug)
                {
                    case "hot-sales":
                        products = await productRepo.GetDiscountedProductsAsync();
                        break;
                    case "accessory":
                        products = await productRepo.GetAccessoriesAsync();
                        break;
                    default:
                        var category = await categoryRepo.GetCategoryBySlugAsync(categorySlug!);
                        if (category == null) return [];

                        var categoryIds = new List<int> { category.CategoryId };
                        if (category.InverseParent != null && category.InverseParent.Count > 0)
                            categoryIds.AddRange(category.InverseParent.Select(c => c.CategoryId));

                        products = await productRepo.GetProductsByCategoryIdAsync(categoryIds);
                        break;
                }

                products = sortOrder switch
                {
                    "newest" => [.. products.Where(a => a.Status == 1).OrderBy(p => p.ProductId)],
                    "discount" => [.. products.Where(a => a.Status == 1).OrderByDescending(p => p.Discount)],
                    "name_asc" => [.. products.Where(a => a.Status == 1).OrderBy(p => p.Name)],
                    "name_desc" => [.. products.Where(a => a.Status == 1).OrderByDescending(p => p.Name)],
                    "price_asc" => [.. products.Where(a => a.Status == 1).OrderBy(p => p.Price)],
                    "price_desc" => [.. products.Where(a => a.Status == 1).OrderByDescending(p => p.Price)],
                    _ => products
                };

                var productDto = _mapper.Map<List<ProductDto>>(products);
                return productDto;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while fetching products by category.", ex);
            }
        }
    }
}
