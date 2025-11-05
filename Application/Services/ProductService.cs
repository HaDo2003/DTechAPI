using AutoMapper;
using DTech.Application.DTOs.request;
using DTech.Application.DTOs.Request;
using DTech.Application.DTOs.response;
using DTech.Application.DTOs.Response;
using DTech.Application.DTOs.Response.Admin;
using DTech.Application.DTOs.Response.Admin.Product;
using DTech.Application.Helper;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

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

                var relatedProducts = await productRepo.GetRelatedProductsAsync(brand.BrandId, product.ProductId);

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
        public async Task<PaginatedProductResDto?> GetProductsByCategoryAsync(string? categorySlug, int page, int pageSize, string? sortOrder)
        {
            try
            {
                if (page <= 0) page = 1;
                if (pageSize <= 0) pageSize = 15;
                IQueryable<Product> products;

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
                            return null;

                        var category = await categoryRepo.GetCategoryBySlugAsync(categorySlug);
                        if (category == null) return null;

                        var categoryIds = new List<int> { category.CategoryId };
                        if (category.InverseParent != null && category.InverseParent.Count > 0)
                            categoryIds.AddRange(category.InverseParent.Select(c => c.CategoryId));

                        products = await productRepo.GetProductsByCategoryIdAsync(categoryIds);
                        break;
                }

                products = QuerySortOrders(sortOrder, products);

                int totalItems = await products.CountAsync();
                int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

                var productLists = await products
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var productDto = _mapper.Map<List<ProductDto>>(productLists);
                return new PaginatedProductResDto
                {
                    Products = productDto,
                    TotalPages = totalPages,
                    TotalItems = totalItems,
                    Title = "All Products"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        //Get products by category slug, brand slug and sort order
        public async Task<PaginatedProductResDto?> GetProductsByCategoryAndBrandAsync(string? categorySlug, string? brandSlug, int page, int pageSize, string? sortOrder)
        {
            try
            {
                if (page <= 0) page = 1;
                if (pageSize <= 0) pageSize = 15;
                IQueryable<Product> products;
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
                                   ?? throw new Exception($"Category with slug '{categorySlug}' not found."); ;

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

                products = QuerySortOrders(sortOrder, products);

                int totalItems = await products.CountAsync();
                int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

                var productLists = await products
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var productDto = _mapper.Map<List<ProductDto>>(productLists);
                return new PaginatedProductResDto
                {
                    Products = productDto,
                    TotalPages = totalPages,
                    TotalItems = totalItems,
                    Title = "All Products"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        // Get all products
        public async Task<PaginatedProductResDto?> GetAllProductsAsync(int page, int pageSize, string? sortOrder)
        {
            try
            {
                if (page <= 0) page = 1;
                if (pageSize <= 0) pageSize = 15;

                var query = await productRepo.GetAllProductsQuery();

                query = QuerySortOrders(sortOrder, query);

                int totalItems = await query.CountAsync();
                int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

                var products = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var productDtos = _mapper.Map<List<ProductDto>>(products);

                var brands = productDtos
                    .Where(p => p.Brand != null)
                    .Select(p => p.Brand)
                    .DistinctBy(b => b!.BrandId)
                    .ToList();

                return new PaginatedProductResDto
                {
                    Products = productDtos,
                    Brands = brands,
                    TotalPages = totalPages,
                    TotalItems = totalItems,
                    Title = "All Products"
                };
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
                                .Select(id => id!.Value)
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

        public async Task<PaginatedProductResDto?> SearchProductsAsync(string query, int page, int pageSize, string sortOrder, string? customerId)
        {
            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 15;

            if (customerId != null)
            {
                var customer = await customerRepo.CheckCustomerAsync(customerId);
                if (!customer)
                {
                    await customerRepo.SaveSearchHistory(customerId, query);
                }
            }

            if (string.IsNullOrWhiteSpace(query))
                return null;

            var products = await productRepo.GetProductByQuery(query);
            products = QuerySortOrders(sortOrder, products);

            int totalItems = await products.CountAsync();
            int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var productLists = await products
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var productDto = _mapper.Map<List<ProductDto>>(productLists);
            return new PaginatedProductResDto
            {
                Products = productDto,
                TotalPages = totalPages,
                TotalItems = totalItems,
                Title = "All Products"
            };
        }

        public async Task<PaginatedProductResDto?> GetFilteredProductsAsync(string categorySlug, FilterReqDto filterRequest, string? brandSlug)
        {
            try
            {
                Console.WriteLine($"[DEBUG SERVICE] Starting filter - Category: {categorySlug}, Brand: {brandSlug}");
                Console.WriteLine($"[DEBUG SERVICE] Page: {filterRequest.Page}, PageSize: {filterRequest.PageSize}");

                if (filterRequest.Page <= 0) filterRequest.Page = 1;
                if (filterRequest.PageSize <= 0) filterRequest.PageSize = 15;

                IQueryable<Product> query = await productRepo.GetAllProductsQuery();
                Console.WriteLine($"[DEBUG SERVICE] Initial query count: {await query.CountAsync()}");

                query = query.ApplyCategoryAndBrandFilter(categorySlug, brandSlug);
                Console.WriteLine($"[DEBUG SERVICE] After category/brand filter: {await query.CountAsync()}");

                query = query.ApplyCommonFilters(filterRequest);
                Console.WriteLine($"[DEBUG SERVICE] After common filters: {await query.CountAsync()}");

                query = query.ApplyCategorySpecificFilters(categorySlug, filterRequest);
                Console.WriteLine($"[DEBUG SERVICE] After category specific filters: {await query.CountAsync()}");

                query = QuerySortOrders(filterRequest.SortOrder, query);

                var totalItems = await query.CountAsync();
                Console.WriteLine($"[DEBUG SERVICE] Total items after filters: {totalItems}");
                var totalPages = (int)Math.Ceiling(totalItems / (double)filterRequest.PageSize);

                var products = await query
                    .Skip((filterRequest.Page - 1) * filterRequest.PageSize)
                    .Take(filterRequest.PageSize)
                    .ToListAsync();

                Console.WriteLine($"[DEBUG SERVICE] Products retrieved: {products.Count}");

                var productDtos = _mapper.Map<List<ProductDto>>(products);
                Console.WriteLine($"[DEBUG SERVICE] ProductDtos mapped: {productDtos.Count}");

                List<BrandDto?>? brandDtos = null;
                if (brandSlug == null)
                {
                    brandDtos = [.. productDtos
                    .Where(p => p.Brand != null)
                    .Select(p => p.Brand!)
                    .DistinctBy(b => b.BrandId)];
                }

                var result = new PaginatedProductResDto
                {
                    Products = productDtos,
                    Brands = brandDtos,
                    TotalPages = totalPages,
                    TotalItems = totalItems,
                    Title = "All Products"
                };

                Console.WriteLine($"[DEBUG SERVICE] Returning result with {result.Products.Count} products");
                return result;

            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DEBUG SERVICE ERROR] {ex.Message}");
                Console.WriteLine($"[DEBUG SERVICE ERROR] Stack: {ex.StackTrace}");
                return null;
            }
        }
        private static IQueryable<Product> QuerySortOrders(string? sortOrder, IQueryable<Product> query)
        {
            return sortOrder switch
            {
                "newest" => query.OrderByDescending(p => p.ProductId),
                "discount" => query.OrderByDescending(p => p.Discount),
                "name_asc" => query.OrderBy(p => p.Name),
                "name_desc" => query.OrderByDescending(p => p.Name),
                "price_asc" => query.OrderBy(p => p.Price),
                "price_desc" => query.OrderByDescending(p => p.Price),
                _ => query
            };
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

        public async Task<IndexResDto<ProductResDto>> GetProductDetailAsync(int productId)
        {
            var product = await productRepo.GetProductByIdAsync(productId);
            if (product == null)
            {
                return new IndexResDto<ProductResDto>
                {
                    Success = false,
                    Message = "Product not found"
                };
            }

            var dto = new ProductResDto
            {
                ProductInfor = product != null
                ? new ProductDetailDto
                {
                    Id = product.ProductId,
                    Name = product.Name,
                    Slug = product.Slug,
                    Warranty = product.Warranty,
                    StatusProduct = product.StatusProduct switch
                    {
                        true => "in stock",
                        false => "out of stock",
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
                }
                : null,
                ProductColors = product != null && product.ProductColors != null && product.ProductColors.Count != 0
                    ? [.. product.ProductColors.Select(color => new ProductColorDto
                    {
                        ColorId = color.ColorId,
                        ColorName = color.ColorName,
                        ColorCode = color.ColorCode
                    })]
                    : [],
                Specifications = product != null && product.Specifications != null && product.Specifications.Count != 0
                    ? [.. product.Specifications.Select(spec => new SpecificationDto
                    {
                        SpecId = spec.SpecId,
                        SpecName = spec.SpecName,
                        Detail = spec.Detail
                    })]
                    : [],
                ProductImages = product != null && product.ProductImages != null && product.ProductImages.Count != 0
                    ? [.. product.ProductImages.Select(img => new ProductImageDto
                    {
                        ImageId = img.ImageId,
                        Image = img.Image,
                        ColorId = img.ColorId
                    })]
                    : [],
                ProductModels = product != null && product.ProductColors != null
                    ? [.. product.ProductColors
                        .Where(pc => pc.ProductModel != null)
                        .Select(pc => new ProductModelDto
                        {
                            ModelId = pc.ProductModel!.ModelId,
                            ModelName = pc.ProductModel.ModelName,
                            ModelUrl = pc.ProductModel.ModelUrl,
                            ColorId = pc.ProductModel.ColorId
                        })]
                    : [],
            };

            return new IndexResDto<ProductResDto>
            {
                Success = true,
                Data = dto
            };
        }

        public async Task<List<SelectResDto>> GetCategoriesAsync()
        {
            var categories = await categoryRepo.GetAvailableCategoriesAsync();
            if (categories == null || categories.Count == 0)
            {
                return [];
            }

            var categoriesDtos = categories.Select(cat => new SelectResDto
            {
                Id = cat.CategoryId,
                Name = cat.Name,
            }).ToList();

            return categoriesDtos;
        }
        public async Task<List<SelectResDto>> GetBrandsAsync()
        {
            var brands = await brandRepo.GetAvailableBrandsAsync();
            if (brands == null || brands.Count == 0)
            {
                return [];
            }

            var brandsDtos = brands.Select(br => new SelectResDto
            {
                Id = br.BrandId,
                Name = br.Name,
            }).ToList();

            return brandsDtos;
        }

        public async Task<IndexResDto<object?>> CreateProductAsync(ProductDetailDto? model, string? currentUserId)
        {
            if (model == null)
            {
                return new IndexResDto<object?>
                {
                    Success = false,
                    Message = "The data is null",
                    Data = null
                };
            }
            try
            {
                Product product = new()
                {
                    Name = model.Name,
                    Slug = model.Name?.ToLower().Replace(" ", "-").Replace("/", "-"),
                    Warranty = model.Warranty,
                    StatusProduct = model.StatusProduct?.Trim().ToLower() switch
                    {
                        "in stock" => true,
                        "out of stock" => false,
                        _ => false
                    },
                    InitialCost = model.InitialCost,
                    Price = model.Price,
                    Discount = model.Discount,
                    PriceAfterDiscount = model.Discount > 0
                        ? ((decimal)model.Price! - ((decimal)model.Price * ((decimal)model.Discount / 100)))
                        : model.Price,
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
                    Data = product.ProductId
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
                    ProductId = productId,
                    Name = model.Name,
                    Slug = model.Name?.ToLower().Replace(" ", "-").Replace("/", "-"),
                    Warranty = model.Warranty,
                    StatusProduct = model.StatusProduct?.Trim().ToLower() switch
                    {
                        "in stock" => true,
                        "out of stock" => false,
                        _ => false
                    },
                    InitialCost = model.InitialCost,
                    Price = model.Price,
                    Discount = model.Discount,
                    PriceAfterDiscount = model.Discount > 0
                        ? ((decimal)model.Price! - ((decimal)model.Price * ((decimal)model.Discount / 100)))
                        : model.Price,
                    EndDateDiscount = model.EndDateDiscount,
                    DateOfManufacture = model.DateOfManufacture,
                    MadeIn = model.MadeIn,
                    Views = model.Views,
                    PromotionalGift = model.PromotionalGift,
                    Description = model.Description,
                    Photo = model.Photo,
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

        public async Task<IndexResDto<object?>> UpdateProductColorsAsync(int productId, List<ProductColorDto> model, string? currentUserId)
        {
            try
            {
                var existingColors = await productRepo.GetColorAsync(productId);
                var existingColorsIds = existingColors.Select(c => c.ColorId).ToList();
                var incomingColorsIds = model.Where(m => m.ColorId > 0).Select(m => m.ColorId).ToList();

                // Delete removed colors
                var colorToDelete = existingColors
                    .Where(c => !incomingColorsIds.Contains(c.ColorId))
                    .ToList();

                if (colorToDelete.Count != 0)
                    await productRepo.DeleteColorsAsync([.. colorToDelete.Select(i => i.ColorId)]);

                foreach (var color in model)
                {
                    if (color.ColorId > 0)
                    {
                        // 🔹 Update existing color
                        var existingColor = existingColors.FirstOrDefault(c => c.ColorId == color.ColorId);
                        if (existingColor != null)
                        {
                            existingColor.ColorName = color.ColorName ?? "";
                            existingColor.ColorCode = color.ColorCode;
                        }
                    }
                    else
                    {
                        var newColor = new ProductColor
                        {
                            ProductId = productId,
                            ColorName = color.ColorName ?? "",
                            ColorCode = color.ColorCode
                        };
                        await productRepo.AddColorAsync(newColor);
                    }
                }
                var result = await productRepo.SaveColorsAsync();
                if (!result)
                {
                    return new IndexResDto<object?>
                    {
                        Success = true,
                        Message = "Colors updated failure.",
                        Data = null
                    };
                }
                return new IndexResDto<object?>
                {
                    Success = true,
                    Message = "Colors updated successfully.",
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
        public async Task<IndexResDto<object?>> UpdateProductSpecificationAsync(int productId, List<SpecificationDto> model, string? currentUserId)
        {
            try
            {
                var existingSpecs = await productRepo.GetSpecificationAsync(productId);
                var existingSpecIds = existingSpecs.Select(s => s.SpecId).ToList();
                var incomingSpecIds = model.Where(m => m.SpecId > 0).Select(m => m.SpecId).ToList();

                // Delete removed specifications
                var specsToDelete = existingSpecs
                    .Where(s => !incomingSpecIds.Contains(s.SpecId))
                    .ToList();

                if (specsToDelete.Count != 0)
                    await productRepo.DeleteSpecificationsAsync([.. specsToDelete.Select(i => i.SpecId)]);

                foreach (var spec in model)
                {
                    var slug = spec.SpecName?.ToLower().Replace(" ", "-");
                    if (spec.SpecId > 0)
                    {
                        // 🔹 Update existing specification
                        var existingSpec = existingSpecs.FirstOrDefault(s => s.SpecId == spec.SpecId);
                        if (existingSpec != null)
                        {
                            existingSpec.SpecName = spec.SpecName;
                            existingSpec.Detail = spec.Detail;
                            existingSpec.Slug = slug ?? existingSpec.Slug;
                        }
                    }
                    else
                    {
                        var newSpec = new Specification
                        {
                            ProductId = productId,
                            SpecName = spec.SpecName,
                            Detail = spec.Detail,
                            Slug = slug,
                        };
                        await productRepo.AddSpecificationAsync(newSpec);
                    }
                }

                var result = await productRepo.SaveSpecificationsAsync();
                if (!result)
                {
                    return new IndexResDto<object?>
                    {
                        Success = true,
                        Message = "Specifications updated failure.",
                        Data = null
                    };
                }
                return new IndexResDto<object?>
                {
                    Success = true,
                    Message = "Specifications updated successfully.",
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

        public async Task<IndexResDto<object?>> UpdateProductImageAsync(
            int productId,
            List<ProductImageDto> model,
            string? currentUserId
        )
        {
            try
            {
                // Get existing images
                var existingImages = await productRepo.GetImageAsync(productId);
                var existingImageIds = existingImages.Select(i => i.ImageId).ToList();
                var incomingImageIds = model.Where(m => m.ImageId > 0).Select(m => m.ImageId).ToList();

                // Delete removed images in batch
                var imagesToDelete = existingImages
                    .Where(i => !incomingImageIds.Contains(i.ImageId))
                    .ToList();

                if (imagesToDelete.Count != 0)
                    await productRepo.DeleteImagesAsync([.. imagesToDelete.Select(i => i.ImageId)]);

                // Prepare tasks for new or updated images
                var uploadTasks = model.Select(async img =>
                {
                    if (img.ImageUpload != null && img.ImageUpload.Length > 0)
                    {
                        // If existing, replace
                        if (img.ImageId > 0)
                        {
                            var existingImage = existingImages.FirstOrDefault(i => i.ImageId == img.ImageId);
                            if (existingImage != null)
                            {
                                string newUrl = await cloudinaryService.ChangeImageAsync(
                                    oldfile: existingImage.Image ?? string.Empty,
                                    newfile: img.ImageUpload,
                                    filepath: folderName
                                );
                                existingImage.Image = newUrl;
                                existingImage.ColorId = img.ColorId;
                            }
                        }
                        else
                        {
                            // New image
                            string newUrl = await cloudinaryService.UploadImageAsync(
                                img.ImageUpload,
                                folderName
                            );
                            return new ProductImage
                            {
                                ProductId = productId,
                                Image = newUrl,
                                ColorId = img.ColorId
                            };
                        }
                    }
                    return null;
                });

                // Wait for all uploads in parallel
                var uploadedImages = (await Task.WhenAll(uploadTasks))
                    .OfType<ProductImage>()
                    .ToList();

                // Add new uploaded images in batch
                if (uploadedImages.Count != 0)
                    await productRepo.AddImagesAsync(uploadedImages);

                // Save everything once
                var result = await productRepo.SaveImagesAsync();

                if (!result)
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = "Image update failed.",
                        Data = null
                    };

                return new IndexResDto<object?>
                {
                    Success = true,
                    Message = "Images updated successfully.",
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

        public async Task<IndexResDto<object?>> UploadGlbAsync(
            int productId,
            GlbReq request
        )
        {
            try
            {
                // Get existing models
                var existingModels = await productRepo.GetModelsAsync(productId);
                var existingModelIds = existingModels.Select(m => m.ModelId).ToList();
                var incomingModelIds = request.Models.Where(m => m.ModelId > 0).Select(m => m.ModelId).ToList();

                // Delete removed models in batch
                var modelsToDelete = existingModels
                    .Where(m => !incomingModelIds.Contains(m.ModelId))
                    .ToList();

                if (modelsToDelete.Count != 0)
                    await productRepo.DeleteModelsAsync([.. modelsToDelete.Select(m => m.ModelId)]);

                // Prepare upload tasks
                var uploadTasks = request.Models.Select(async model =>
                {
                    if (model.ModelId > 0)
                    {
                        var existingModel = existingModels.FirstOrDefault(m => m.ModelId == model.ModelId);
                        if (existingModel != null)
                        {
                            existingModel.ColorId = model.ColorId;
                            existingModel.ModelName = model.ModelName;

                            if (model.ModelUpload != null && model.ModelUpload.Length > 0)
                            {
                                string newUrl = await cloudinaryService.UploadGlbAsync(
                                    model.ModelUpload,
                                    "Pre-thesis/Product/3DModel"
                                );
                                existingModel.ModelUrl = newUrl;
                                existingModel.UploadedDate = DateTime.UtcNow;
                                existingModel.ModelType = "glb";
                            }
                        }

                        return (ProductModel?)null;
                    }

                    if (model.ModelUpload != null && model.ModelUpload.Length > 0)
                    {
                        string newUrl = await cloudinaryService.UploadGlbAsync(
                            model.ModelUpload,
                            "Pre-thesis/Product/3DModel"
                        );

                        return new ProductModel
                        {
                            ModelUrl = newUrl,
                            ColorId = model.ColorId,
                            ModelName = model.ModelName,
                            UploadedDate = DateTime.UtcNow,
                            ModelType = "glb"
                        };
                    }

                    return (ProductModel?)null;
                });

                // Wait for uploads in parallel
                var uploadedModels = (await Task.WhenAll(uploadTasks))
                    .OfType<ProductModel>()
                    .ToList();

                Console.WriteLine("=== Models before saving ===");
                foreach (var model in existingModels)
                {
                    Console.WriteLine($"Existing → Id: {model.ModelId}, Name: {model.ModelName}, ColorId: {model.ColorId}");
                }
                foreach (var model in uploadedModels)
                {
                    Console.WriteLine($"New → Name: {model.ModelName}, ColorId: {model.ColorId}");
                }
                Console.WriteLine("============================");

                // Add new uploaded models
                if (uploadedModels.Count != 0)
                    await productRepo.AddModelsAsync(uploadedModels);

                // Save changes once
                var result = await productRepo.SaveModelsAsync();

                if (!result)
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = "3D model update failed.",
                        Data = null
                    };

                return new IndexResDto<object?>
                {
                    Success = true,
                    Message = "3D models updated successfully.",
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
