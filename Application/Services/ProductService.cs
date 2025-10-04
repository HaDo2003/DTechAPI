using AutoMapper;
using DTech.Application.DTOs.request;
using DTech.Application.DTOs.response;
using DTech.Application.DTOs.response.admin;
using DTech.Application.DTOs.Response.Admin.Product;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Enums;
using DTech.Domain.Interfaces;

namespace DTech.Application.Services
{
    public class ProductService(
        IBrandRepository brandRepo,
        ICategoryRepository categoryRepo,
        IProductRepository productRepo,
        ICustomerRepository customerRepo,
        IAdminRepository adminRepo,
        ICloudinaryService cloudinaryService,
        IMapper _mapper
        ) : IProductService
    {
        readonly string folderName = "Pre-thesis/Product";
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
                        if (string.IsNullOrWhiteSpace(categorySlug))
                            return [];

                        var category = await categoryRepo.GetCategoryBySlugAsync(categorySlug);
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
                "newest" => [.. products.Where(a => a.Status == StatusEnums.Available).OrderBy(p => p.ProductId)],
                "discount" => [.. products.Where(a => a.Status == StatusEnums.Available).OrderByDescending(p => p.Discount)],
                "name_asc" => [.. products.Where(a => a.Status == StatusEnums.Available).OrderBy(p => p.Name)],
                "name_desc" => [.. products.Where(a => a.Status == StatusEnums.Available).OrderByDescending(p => p.Name)],
                "price_asc" => [.. products.Where(a => a.Status == StatusEnums.Available).OrderBy(p => p.Price)],
                "price_desc" => [.. products.Where(a => a.Status == StatusEnums.Available).OrderByDescending(p => p.Price)],
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

        // For admin
        public async Task<IndexResDto<List<ProductIndexDto>>> GetProductsAsync()
        {
            var products = await productRepo.GetAllProductsAsync();
            if (products == null || products.Count == 0)
            {
                return new IndexResDto<List<ProductIndexDto>>
                {
                    Success = false,
                    Message = "No product found"
                };
            }

            var productDtos = products.Select(p => new ProductIndexDto
            {
                Id = p.ProductId,
                Name = p.Name,
                Price = p.Price,
                StatusProduct = p.StatusProduct == true ? "In stock"
                       : p.StatusProduct == false ? "Out of stock"
                       : "Unknown",
            }).ToList();

            return new IndexResDto<List<ProductIndexDto>>
            {
                Success = true,
                Data = productDtos
            };
        }

        public async Task<IndexResDto<ProductDetailDto>> GetProductDetailAsync(int productId)
        {
            var product = await productRepo.GetProductByIdAsync(productId);
            if (product == null)
            {
                return new IndexResDto<ProductDetailDto>
                {
                    Success = false,
                    Message = "Product not found"
                };
            }

            var dto = new ProductDetailDto
            {
                Id = product.ProductId,
                Name = product.Name,
                Slug = product.Slug,
                Warranty = product.Warranty,
                StatusProduct = product.StatusProduct switch
                {
                    true => "In stock",
                    false => "Out of stock",
                    null => "Unknown"
                },
                InitialCost = product.InitialCost,
                Price = product.Price,
                Discount = product.Discount,
                PriceAfterDiscount = product.PriceAfterDiscount,
                EndDateDiscount = product.EndDateDiscount,
                DateOfManufacture = product.DateOfManufacture,
                MadeIn = product.MadeIn,
                Views = product.Views,
                PromotionalGift = product.PromotionalGift,
                Photo = product.Photo,
                Description = product.Description,
                BrandId = product.BrandId,
                CategoryId = product.CategoryId,
                CreateDate = product.CreateDate,
                CreatedBy = product.CreatedBy,
                UpdateDate = product.UpdateDate,
                UpdatedBy = product.UpdatedBy,
                Specifications = product.Specifications != null && product.Specifications.Count != 0
                    ? [.. product.Specifications.Select(spec => new SpecificationDto
                    {
                        SpecId = spec.SpecId,
                        SpecName = spec.SpecName,
                        Detail = spec.Detail
                    })]
                    : [],
                ProductImages = product.ProductImages != null && product.ProductImages.Count != 0
                    ? [.. product.ProductImages.Select(img => new ProductImageDto
                    {
                        ImageId = img.ImageId,
                        Image = img.Image
                    })]
                    : [],
            };

            return new IndexResDto<ProductDetailDto>
            {
                Success = true,
                Data = dto
            };
        }

        public async Task<IndexResDto<object?>> CreateProductAsync(ProductDetailDto model, string? currentUserId)
        {
            try
            {
                Product product = new()
                {
                    Name = model.Name,
                    Slug = model.Name?.ToLower().Replace(" ", "-").Replace("/", "-"),
                    Warranty = model.Warranty,
                    StatusProduct = model.StatusProduct?.ToLower() switch
                    {
                        "in stock" => true,
                        "out of stock" => false,
                        _ => null
                    },
                    InitialCost = model.InitialCost,
                    Price = model.Price,
                    Discount = model.Discount,
                    PriceAfterDiscount = model.PriceAfterDiscount,
                    EndDateDiscount = model.EndDateDiscount,
                    DateOfManufacture = model.DateOfManufacture,
                    MadeIn = model.MadeIn,
                    Views = model.Views,
                    PromotionalGift = model.PromotionalGift,
                    Description = model.Description,
                    BrandId = model.BrandId,
                    CategoryId = model.CategoryId,
                    CreateDate = DateTime.UtcNow,
                    CreatedBy = await adminRepo.GetAdminFullNameAsync(currentUserId),
                };

                product.Slug = product.Name?.ToLower().Replace(" ", "-").Replace("/", "-");

                var existingProduct = await productRepo.CheckIfProductExistsAsync(product);
                if (existingProduct)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = "Product with same name exists",
                        Data = null
                    };
                }

                if (model.PhotoUpload != null && model.PhotoUpload.Length > 0)
                {
                    string imageName = await cloudinaryService.UploadImageAsync(
                        model.PhotoUpload,
                        folderName
                    );

                    if (string.IsNullOrEmpty(imageName))
                    {
                        return new IndexResDto<object?>
                        {
                            Success = false,
                            Message = "Image upload failed",
                            Data = null
                        };
                    }

                    product.Photo = imageName;
                }

                var (Success, Message) = await productRepo.CreateProductAsync(product);

                if (!Success)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = Message,
                        Data = null
                    };
                }

                return new IndexResDto<object?>
                {
                    Success = true,
                    Message = "Product created successfully",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new IndexResDto<object?>
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<IndexResDto<object?>> UpdateProductAsync(int productId, ProductDetailDto model, string? currentUserId)
        {
            try
            {
                Product product = new()
                {
                    Name = model.Name,
                    Slug = model.Name?.ToLower().Replace(" ", "-").Replace("/", "-"),
                    Warranty = model.Warranty,
                    StatusProduct = model.StatusProduct?.ToLower() switch
                    {
                        "in stock" => true,
                        "out of stock" => false,
                        _ => null
                    },
                    InitialCost = model.InitialCost,
                    Price = model.Price,
                    Discount = model.Discount,
                    PriceAfterDiscount = model.PriceAfterDiscount,
                    EndDateDiscount = model.EndDateDiscount,
                    DateOfManufacture = model.DateOfManufacture,
                    MadeIn = model.MadeIn,
                    Views = model.Views,
                    PromotionalGift = model.PromotionalGift,
                    Description = model.Description,
                    BrandId = model.BrandId,
                    CategoryId = model.CategoryId,
                    CreateDate = DateTime.UtcNow,
                    CreatedBy = await adminRepo.GetAdminFullNameAsync(currentUserId),
                    UpdateDate = DateTime.UtcNow,
                    UpdatedBy = await adminRepo.GetAdminFullNameAsync(currentUserId),
                };

                string newSlug = model.Name?.ToLower().Replace(" ", "-").Replace("/", "-") ?? string.Empty;
                product.Slug = newSlug;

                var existingProduct = await productRepo.CheckIfProductExistsAsync(product);
                if (existingProduct)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = "Product with the same name already exists",
                        Data = null
                    };
                }

                // Handle image change
                if (model.PhotoUpload != null && model.PhotoUpload.Length > 0)
                {
                    string imageName = await cloudinaryService.ChangeImageAsync(
                        oldfile: model.Photo ?? string.Empty,
                        newfile: model.PhotoUpload,
                        filepath: folderName
                    );

                    if (string.IsNullOrEmpty(imageName))
                    {
                        return new IndexResDto<object?>
                        {
                            Success = false,
                            Message = "Image upload failed",
                            Data = null
                        };
                    }

                    product.Photo = imageName;
                }

                var (Success, Message) = await productRepo.UpdateProductAsync(product);
                if (!Success)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = Message,
                        Data = null
                    };
                }
                return new IndexResDto<object?>
                {
                    Success = true,
                    Message = "Product updated successfully",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new IndexResDto<object?>
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<IndexResDto<object?>> DeleteProductAsync(int productId)
        {
            try
            {
                var (Success, Message) = await productRepo.DeleteProductAsync(productId);
                if (!Success)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = Message,
                        Data = null
                    };
                }
                return new IndexResDto<object?>
                {
                    Success = true,
                    Message = "Product deleted successfully",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new IndexResDto<object?>
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}",
                    Data = null
                };
            }
        }
    }
}
