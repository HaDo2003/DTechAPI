using AutoMapper;
using DTech.Application.DTOs.request;
using DTech.Application.DTOs.response;
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
        public async Task<ProductDto?> ProductDetailAsync(string categorySlug, string brandSlug, string slug)
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
                return null;
            }
        }

        //Get products by category slug and sort order
        public async Task<List<ProductDto>?> GetProductsByCategoryAsync(string? categorySlug, string? sortOrder)
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

                products = SortOrders(sortOrder, products);

                var productDto = _mapper.Map<List<ProductDto>>(products);
                return productDto;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        //Get products by category slug, brand slug and sort order
        public async Task<List<ProductDto>?> GetProductsByCategoryAndBrandAsync(string? categorySlug, string? brandSlug, string? sortOrder)
        {
            try
            {
                var products = new List<Product>();
                Category? category = new();
                Brand? brand = await brandRepo.GetBrandBySlugAsync(brandSlug) 
                    ?? throw new Exception($"Brand with slug '{brandSlug}' not found."); ;

                switch (categorySlug)
                {
                    case "hot-sales":
                        products = await productRepo.GetDiscountedProductsAsync(brand.BrandId);
                        break;
                    case "accessory":
                        products = await productRepo.GetAccessoriesAsync(brand.BrandId);
                        break;
                    default:
                        category = await categoryRepo.GetCategoryBySlugAsync(categorySlug)
                                   ?? throw new Exception($"Category with slug '{categorySlug}' not found.");;

                        // Get category IDs: main + all its children
                        var categoryIds = new List<int> { category.CategoryId };

                        // Include subcategory IDs
                        if (category.InverseParent != null && category.InverseParent.Count != 0)
                        {
                            categoryIds.AddRange(category.InverseParent.Select(c => c.CategoryId));
                        }

                        products = await productRepo.GetByCategoryAndBrandAsync(category.CategoryId, brand.BrandId);
                        break;
                }

                products = SortOrders(sortOrder, products);

                var productDto = _mapper.Map<List<ProductDto>>(products);
                return productDto;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        //Get recently viewed products by their IDs
        public async Task<List<ProductDto>> GetRecentlyViewedProductsAsync(string? ids)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(ids))
                {
                    return [];
                }
                var idList = ids.Split(',')
                                .Select(id => int.TryParse(id, out var parsedId) ? parsedId : (int?)null)
                                .Where(id => id.HasValue)
                                .Select(id => id.Value)
                                .ToList();
                if (idList.Count == 0)
                {
                    return [];
                }
                var products = await productRepo.GetProductsByIdListAsync(idList);
                // Sort products based on the order of IDs in the input string
                var sortedProducts = idList.Select(id => products.FirstOrDefault(p => p.ProductId == id))
                                           .Where(p => p != null)
                                           .ToList()!;
                var productDto = _mapper.Map<List<ProductDto>>(sortedProducts);
                return productDto;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw new Exception("An error occurred while fetching recently viewed products.", ex);
            }
        }

        private static List<Product> SortOrders(string? sortOrder, List<Product> products)
        {
            return sortOrder switch
            {
                "newest" => [.. products.Where(a => a.Status == 1).OrderBy(p => p.ProductId)],
                "discount" => [.. products.Where(a => a.Status == 1).OrderByDescending(p => p.Discount)],
                "name_asc" => [.. products.Where(a => a.Status == 1).OrderBy(p => p.Name)],
                "name_desc" => [.. products.Where(a => a.Status == 1).OrderByDescending(p => p.Name)],
                "price_asc" => [.. products.Where(a => a.Status == 1).OrderBy(p => p.Price)],
                "price_desc" => [.. products.Where(a => a.Status == 1).OrderByDescending(p => p.Price)],
                _ => products
            };
        }

        public async Task<ProductCommentDto> PostCommentAsync(ProductCommentRequestDto model)
        {
            var productComment = _mapper.Map<ProductComment>(model);
            var commentId = await productRepo.AddProductCommentAsync(productComment);
            if (commentId == null)
                return new ProductCommentDto { Success = false, Message = "Failed to post comment" };

            return new ProductCommentDto
            {
                Success = true,
                Message = "Post comment successfully",
                CommentId = commentId
            };
        }

        public async Task<List<ProductDto>> SearchProductsAsync(string query, string sortOrder, string? customerId)
        {
            if(customerId != null)
            {
                var customer = await customerRepo.CheckCustomerAsync(customerId);
                if (!customer)
                {
                    await customerRepo.SaveSearchHistory(customerId, query);
                }
            }

            if (string.IsNullOrWhiteSpace(query))
                return [];

            var products = await productRepo.GetProductByQuery(query);
            products = SortOrders(sortOrder, [.. products]);

            var productDto = _mapper.Map<List<ProductDto>>(products);
            return productDto;
        }
    }
}
