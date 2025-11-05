using AutoMapper;
using DTech.Application.DTOs.request;
using DTech.Application.DTOs.response;
using DTech.Application.DTOs.Response;
using DTech.Application.DTOs.Response.Admin.Product;
using DTech.Application.Interfaces;
using DTech.Application.Services;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore.Query;
using Moq;
using System.Linq.Expressions;
using Xunit;

namespace DTech.UnitTest.Services
{
    public class ProductServiceTests
    {
        private readonly Mock<IBrandRepository> _brandRepoMock;
        private readonly Mock<ICategoryRepository> _categoryRepoMock;
        private readonly Mock<IProductRepository> _productRepoMock;
        private readonly Mock<ICustomerRepository> _customerRepoMock;
        private readonly Mock<IAdminRepository> _adminRepoMock;
        private readonly Mock<ICloudinaryService> _cloudinaryServiceMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly ProductService _productService;

        public ProductServiceTests()
        {
            _brandRepoMock = new Mock<IBrandRepository>();
            _categoryRepoMock = new Mock<ICategoryRepository>();
            _productRepoMock = new Mock<IProductRepository>();
            _customerRepoMock = new Mock<ICustomerRepository>();
            _adminRepoMock = new Mock<IAdminRepository>();
            _cloudinaryServiceMock = new Mock<ICloudinaryService>();
            _mapperMock = new Mock<IMapper>();

            _productService = new ProductService(
                _brandRepoMock.Object,
                _categoryRepoMock.Object,
                _productRepoMock.Object,
                _customerRepoMock.Object,
                _adminRepoMock.Object,
                _cloudinaryServiceMock.Object,
                _mapperMock.Object
            );
        }

        // --------------------------------------------------------------------
        // PRODUCT DETAIL TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task ProductDetailAsync_CategoryNotFound_ReturnsNull()
        {
            // Arrange
            var categorySlug = "invalid-category";
            var brandSlug = "valid-brand";
            var productSlug = "valid-product";

            _categoryRepoMock.Setup(repo => repo.GetCategoryBySlugAsync(categorySlug))
                .ReturnsAsync((Category?)null);

            // Act
            var result = await _productService.ProductDetailAsync(categorySlug, brandSlug, productSlug);

            // Assert
            result.Should().BeNull();
            _brandRepoMock.Verify(repo => repo.GetBrandBySlugAsync(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task ProductDetailAsync_BrandNotFound_ReturnsNull()
        {
            // Arrange
            var categorySlug = "valid-category";
            var brandSlug = "invalid-brand";
            var productSlug = "valid-product";

            var category = new Category
            {
                CategoryId = 1,
                Name = "Laptops",
                Slug = categorySlug
            };

            _categoryRepoMock.Setup(repo => repo.GetCategoryBySlugAsync(categorySlug))
                .ReturnsAsync(category);
            _brandRepoMock.Setup(repo => repo.GetBrandBySlugAsync(brandSlug))
                .ReturnsAsync((Brand?)null);

            // Act
            var result = await _productService.ProductDetailAsync(categorySlug, brandSlug, productSlug);

            // Assert
            result.Should().BeNull();
            _productRepoMock.Verify(repo => repo.GetBySlugAsync(It.IsAny<string>(), It.IsAny<int>(), It.IsAny<int>()), Times.Never);
        }

        [Fact]
        public async Task ProductDetailAsync_ProductNotFound_ReturnsNull()
        {
            // Arrange
            var categorySlug = "laptops";
            var brandSlug = "dell";
            var productSlug = "invalid-product";

            var category = new Category { CategoryId = 1, Name = "Laptops", Slug = categorySlug };
            var brand = new Brand { BrandId = 1, Name = "Dell", Slug = brandSlug };

            _categoryRepoMock.Setup(repo => repo.GetCategoryBySlugAsync(categorySlug))
                .ReturnsAsync(category);
            _brandRepoMock.Setup(repo => repo.GetBrandBySlugAsync(brandSlug))
                .ReturnsAsync(brand);
            _productRepoMock.Setup(repo => repo.GetBySlugAsync(productSlug, category.CategoryId, brand.BrandId))
                .ReturnsAsync((Product?)null);

            // Act
            var result = await _productService.ProductDetailAsync(categorySlug, brandSlug, productSlug);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task ProductDetailAsync_Success_ReturnsProductWithRelatedProducts()
        {
            // Arrange
            var categorySlug = "laptops";
            var brandSlug = "dell";
            var productSlug = "dell-xps-15";

            var category = new Category { CategoryId = 1, Name = "Laptops", Slug = categorySlug };
            var brand = new Brand { BrandId = 1, Name = "Dell", Slug = brandSlug };
            var product = new Product
            {
                ProductId = 1,
                Name = "Dell XPS 15",
                Slug = productSlug,
                Price = 1500,
                BrandId = brand.BrandId,
                CategoryId = category.CategoryId
            };

            var relatedProducts = new List<Product>
            {
                new() { ProductId = 2, Name = "Dell XPS 13", BrandId = brand.BrandId }
            };

            var productDto = new ProductDto { ProductId = 1, Name = "Dell XPS 15" };
            var relatedProductDtos = new List<RelatedProductDto>
            {
                new() { ProductId = 2, Name = "Dell XPS 13" }
            };

            _categoryRepoMock.Setup(repo => repo.GetCategoryBySlugAsync(categorySlug))
                .ReturnsAsync(category);
            _brandRepoMock.Setup(repo => repo.GetBrandBySlugAsync(brandSlug))
                .ReturnsAsync(brand);
            _productRepoMock.Setup(repo => repo.GetBySlugAsync(productSlug, category.CategoryId, brand.BrandId))
                .ReturnsAsync(product);
            _productRepoMock.Setup(repo => repo.GetRelatedProductsAsync(brand.BrandId, product.ProductId))
                .ReturnsAsync(relatedProducts);
            _productRepoMock.Setup(repo => repo.IncrementProductViewsAsync(product.ProductId))
                .ReturnsAsync(true);
            _mapperMock.Setup(m => m.Map<ProductDto>(product))
                .Returns(productDto);
            _mapperMock.Setup(m => m.Map<List<RelatedProductDto>>(relatedProducts))
                .Returns(relatedProductDtos);

            // Act
            var result = await _productService.ProductDetailAsync(categorySlug, brandSlug, productSlug);

            // Assert
            result.Should().NotBeNull();
            result!.ProductId.Should().Be(1);
            result.Name.Should().Be("Dell XPS 15");
            result.RelatedProducts.Should().HaveCount(1);
            _productRepoMock.Verify(repo => repo.IncrementProductViewsAsync(product.ProductId), Times.Once);
        }

        // --------------------------------------------------------------------
        // GET RECENTLY VIEWED PRODUCTS TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task GetRecentlyViewedProductsAsync_EmptyIds_ReturnsEmptyList()
        {
            // Arrange
            string? ids = null;

            // Act
            var result = await _productService.GetRecentlyViewedProductsAsync(ids);

            // Assert
            result.Should().BeEmpty();
            _productRepoMock.Verify(repo => repo.GetProductsByIdListAsync(It.IsAny<List<int>>()), Times.Never);
        }

        [Fact]
        public async Task GetRecentlyViewedProductsAsync_InvalidIds_ReturnsEmptyList()
        {
            // Arrange
            var ids = "abc,def,xyz";

            // Act
            var result = await _productService.GetRecentlyViewedProductsAsync(ids);

            // Assert
            result.Should().BeEmpty();
        }

        [Fact]
        public async Task GetRecentlyViewedProductsAsync_ValidIds_ReturnsProductsInOrder()
        {
            // Arrange
            var ids = "3,1,2";
            var products = new List<Product>
            {
                new() { ProductId = 1, Name = "Product 1" },
                new() { ProductId = 2, Name = "Product 2" },
                new() { ProductId = 3, Name = "Product 3" }
            };

            var productDtos = new List<ProductDto>
            {
                new() { ProductId = 3, Name = "Product 3" },
                new() { ProductId = 1, Name = "Product 1" },
                new() { ProductId = 2, Name = "Product 2" }
            };

            _productRepoMock.Setup(repo => repo.GetProductsByIdListAsync(It.IsAny<List<int>>()))
                .ReturnsAsync(products);
            _mapperMock.Setup(m => m.Map<List<ProductDto>>(It.IsAny<List<Product>>()))
                .Returns(productDtos);

            // Act
            var result = await _productService.GetRecentlyViewedProductsAsync(ids);

            // Assert
            result.Should().HaveCount(3);
            result[0].ProductId.Should().Be(3);
            result[1].ProductId.Should().Be(1);
            result[2].ProductId.Should().Be(2);
        }

        // --------------------------------------------------------------------
        // POST COMMENT TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task PostCommentAsync_Success_ReturnsCommentId()
        {
            // Arrange
            var requestDto = new ProductCommentRequestDto
            {
                ProductId = 1,
                Name = "customer123",
                Detail = "Great product!"
            };

            var productComment = new ProductComment
            {
                ProductId = 1,
                Name = "customer123",
                Detail = "Great product!"
            };

            _mapperMock.Setup(m => m.Map<ProductComment>(requestDto))
                .Returns(productComment);
            _productRepoMock.Setup(repo => repo.AddProductCommentAsync(productComment))
                .ReturnsAsync(1);

            // Act
            var result = await _productService.PostCommentAsync(requestDto);

            // Assert
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Post comment successfully");
            result.CommentId.Should().Be(1);
        }

        [Fact]
        public async Task PostCommentAsync_Failure_ReturnsFailureMessage()
        {
            // Arrange
            var requestDto = new ProductCommentRequestDto
            {
                ProductId = 1,
                Name = "customer123",
                Detail = "Great product!"
            };

            var productComment = new ProductComment
            {
                ProductId = 1,
                Name = "customer123",
                Detail = "Great product!"
            };

            _mapperMock.Setup(m => m.Map<ProductComment>(requestDto))
                .Returns(productComment);
            _productRepoMock.Setup(repo => repo.AddProductCommentAsync(productComment))
                .ReturnsAsync((int?)null);

            // Act
            var result = await _productService.PostCommentAsync(requestDto);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Failed to post comment");
        }

        // --------------------------------------------------------------------
        // SEARCH PRODUCTS TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task SearchProductsAsync_EmptyQuery_ReturnsNull()
        {
            // Arrange
            var query = "";
            var page = 1;
            var pageSize = 15;
            var sortOrder = "newest";
            string? customerId = null;

            // Act
            var result = await _productService.SearchProductsAsync(query, page, pageSize, sortOrder, customerId);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task SearchProductsAsync_WithCustomer_SavesSearchHistory()
        {
            // Arrange
            var query = "laptop";
            var page = 1;
            var pageSize = 15;
            var sortOrder = "newest";
            var customerId = "customer123";

            var products = new List<Product>
            {
                new() { ProductId = 1, Name = "Laptop 1" }
            };

            var productDtos = new List<ProductDto>
            {
                new() { ProductId = 1, Name = "Laptop 1" }
            };

            _customerRepoMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(false);
            _customerRepoMock.Setup(repo => repo.SaveSearchHistory(customerId, query))
                .Returns(Task.CompletedTask);
            _productRepoMock.Setup(repo => repo.GetProductByQuery(query))
                .ReturnsAsync(MockAsyncQueryable(products));
            _mapperMock.Setup(m => m.Map<List<ProductDto>>(It.IsAny<List<Product>>()))
                .Returns(productDtos);

            // Act
            var result = await _productService.SearchProductsAsync(query, page, pageSize, sortOrder, customerId);

            // Assert
            result.Should().NotBeNull();
            result!.Products.Should().HaveCount(1);
            _customerRepoMock.Verify(repo => repo.SaveSearchHistory(customerId, query), Times.Once);
        }

        private static IQueryable<T> MockAsyncQueryable<T>(List<T> data) where T : class
        {
            var mockSet = new Mock<Microsoft.EntityFrameworkCore.DbSet<T>>();
            var queryable = data.AsQueryable();

            mockSet.As<IQueryable<T>>().Setup(m => m.Provider)
                .Returns(new TestAsyncQueryProvider<T>(queryable.Provider));
            mockSet.As<IQueryable<T>>().Setup(m => m.Expression).Returns(queryable.Expression);
            mockSet.As<IQueryable<T>>().Setup(m => m.ElementType).Returns(queryable.ElementType);
            mockSet.As<IQueryable<T>>().Setup(m => m.GetEnumerator()).Returns(queryable.GetEnumerator());

            return mockSet.Object;
        }

        // --------------------------------------------------------------------
        // GET PRODUCTS FOR ADMIN TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task GetProductsAsync_NoProducts_ReturnsFailure()
        {
            // Arrange
            _productRepoMock.Setup(repo => repo.GetAllProductsAsync())
                .ReturnsAsync([]);

            // Act
            var result = await _productService.GetProductsAsync();

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("No product found");
        }

        [Fact]
        public async Task GetProductsAsync_HasProducts_ReturnsProductList()
        {
            // Arrange
            var products = new List<Product>
            {
                new() { ProductId = 1, Name = "Product 1", Price = 100, StatusProduct = true },
                new() { ProductId = 2, Name = "Product 2", Price = 200, StatusProduct = false }
            };

            _productRepoMock.Setup(repo => repo.GetAllProductsAsync())
                .ReturnsAsync(products);

            // Act
            var result = await _productService.GetProductsAsync();

            // Assert
            result.Success.Should().BeTrue();
            result.Data.Should().HaveCount(2);
            result.Data![0].Name.Should().Be("Product 1");
            result.Data[0].StatusProduct.Should().Be("In stock");
            result.Data[1].StatusProduct.Should().Be("Out of stock");
        }

        // --------------------------------------------------------------------
        // GET PRODUCT DETAIL FOR ADMIN TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task GetProductDetailAsync_ProductNotFound_ReturnsFailure()
        {
            // Arrange
            var productId = 999;

            _productRepoMock.Setup(repo => repo.GetProductByIdAsync(productId))
                .ReturnsAsync((Product?)null);

            // Act
            var result = await _productService.GetProductDetailAsync(productId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Product not found");
        }

        [Fact]
        public async Task GetProductDetailAsync_Success_ReturnsProductWithDetails()
        {
            // Arrange
            var productId = 1;
            var product = new Product
            {
                ProductId = productId,
                Name = "Product 1",
                Price = 100,
                StatusProduct = true,
                ProductColors =
                [
                    new() { ColorId = 1, ColorName = "Red", ColorCode = "#FF0000" }
                ],
                Specifications =
                [
                    new() { SpecId = 1, SpecName = "CPU", Detail = "Intel i7" }
                ],
                ProductImages =
                [
                    new() { ImageId = 1, Image = "img1.jpg", ColorId = 1 }
                ]
            };

            _productRepoMock.Setup(repo => repo.GetProductByIdAsync(productId))
                .ReturnsAsync(product);

            // Act
            var result = await _productService.GetProductDetailAsync(productId);

            // Assert
            result.Success.Should().BeTrue();
            result.Data.Should().NotBeNull();
            result.Data!.ProductInfor.Should().NotBeNull();
            result.Data.ProductInfor!.Name.Should().Be("Product 1");
            result.Data.ProductColors.Should().HaveCount(1);
            result.Data.Specifications.Should().HaveCount(1);
            result.Data.ProductImages.Should().HaveCount(1);
        }

        // --------------------------------------------------------------------
        // GET CATEGORIES TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task GetCategoriesAsync_NoCategories_ReturnsEmptyList()
        {
            // Arrange
            _categoryRepoMock.Setup(repo => repo.GetAvailableCategoriesAsync())
                .ReturnsAsync([]);

            // Act
            var result = await _productService.GetCategoriesAsync();

            // Assert
            result.Should().BeEmpty();
        }

        [Fact]
        public async Task GetCategoriesAsync_HasCategories_ReturnsCategoryList()
        {
            // Arrange
            var categories = new List<Category>
            {
                new() { CategoryId = 1, Name = "Laptops" },
                new() { CategoryId = 2, Name = "Phones" }
            };

            _categoryRepoMock.Setup(repo => repo.GetAvailableCategoriesAsync())
                .ReturnsAsync(categories);

            // Act
            var result = await _productService.GetCategoriesAsync();

            // Assert
            result.Should().HaveCount(2);
            result[0].Name.Should().Be("Laptops");
            result[1].Name.Should().Be("Phones");
        }

        // --------------------------------------------------------------------
        // GET BRANDS TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task GetBrandsAsync_NoBrands_ReturnsEmptyList()
        {
            // Arrange
            _brandRepoMock.Setup(repo => repo.GetAvailableBrandsAsync())
                .ReturnsAsync(new List<Brand>());

            // Act
            var result = await _productService.GetBrandsAsync();

            // Assert
            result.Should().BeEmpty();
        }

        [Fact]
        public async Task GetBrandsAsync_HasBrands_ReturnsBrandList()
        {
            // Arrange
            var brands = new List<Brand>
            {
                new() { BrandId = 1, Name = "Dell" },
                new() { BrandId = 2, Name = "HP" }
            };

            _brandRepoMock.Setup(repo => repo.GetAvailableBrandsAsync())
                .ReturnsAsync(brands);

            // Act
            var result = await _productService.GetBrandsAsync();

            // Assert
            result.Should().HaveCount(2);
            result[0].Name.Should().Be("Dell");
            result[1].Name.Should().Be("HP");
        }

        // --------------------------------------------------------------------
        // CREATE PRODUCT TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task CreateProductAsync_NullModel_ReturnsFailure()
        {
            // Arrange
            ProductDetailDto? model = null;
            var currentUserId = "admin123";

            // Act
            var result = await _productService.CreateProductAsync(model, currentUserId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("The data is null");
        }

        [Fact]
        public async Task CreateProductAsync_ProductExists_ReturnsFailure()
        {
            // Arrange
            var model = new ProductDetailDto
            {
                Name = "Existing Product",
                Price = 100,
                BrandId = 1,
                CategoryId = 1
            };
            var currentUserId = "admin123";

            _productRepoMock.Setup(repo => repo.CheckIfProductExistsAsync(It.IsAny<Product>()))
                .ReturnsAsync(true);

            // Act
            var result = await _productService.CreateProductAsync(model, currentUserId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Product with same name exists");
        }

        [Fact]
        public async Task CreateProductAsync_WithImage_Success()
        {
            // Arrange
            var mockFile = new Mock<IFormFile>();
            mockFile.Setup(f => f.Length).Returns(1024);

            var model = new ProductDetailDto
            {
                Name = "New Product",
                Price = 100,
                Discount = 10,
                BrandId = 1,
                CategoryId = 1,
                StatusProduct = "in stock",
                PhotoUpload = mockFile.Object
            };
            var currentUserId = "admin123";

            _productRepoMock.Setup(repo => repo.CheckIfProductExistsAsync(It.IsAny<Product>()))
                .ReturnsAsync(false);
            _adminRepoMock.Setup(repo => repo.GetAdminFullNameAsync(currentUserId))
                .ReturnsAsync("Admin User");
            _cloudinaryServiceMock.Setup(s => s.UploadImageAsync(It.IsAny<IFormFile>(), It.IsAny<string>()))
                .ReturnsAsync("uploaded-image.jpg");
            _productRepoMock.Setup(repo => repo.CreateProductAsync(It.IsAny<Product>()))
                .ReturnsAsync((true, "Success"));

            // Act
            var result = await _productService.CreateProductAsync(model, currentUserId);

            // Assert
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Product created successfully");
            _cloudinaryServiceMock.Verify(s => s.UploadImageAsync(It.IsAny<IFormFile>(), It.IsAny<string>()), Times.Once);
        }

        // --------------------------------------------------------------------
        // UPDATE PRODUCT TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task UpdateProductAsync_ProductExists_ReturnsFailure()
        {
            // Arrange
            var productId = 1;
            var model = new ProductDetailDto
            {
                Name = "Existing Product",
                Price = 100,
                BrandId = 1,
                CategoryId = 1
            };
            var currentUserId = "admin123";

            _productRepoMock.Setup(repo => repo.CheckIfProductExistsAsync(It.IsAny<Product>()))
                .ReturnsAsync(true);

            // Act
            var result = await _productService.UpdateProductAsync(productId, model, currentUserId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Product with the same name already exists");
        }

        [Fact]
        public async Task UpdateProductAsync_WithImageChange_Success()
        {
            // Arrange
            var productId = 1;
            var mockFile = new Mock<IFormFile>();
            mockFile.Setup(f => f.Length).Returns(1024);

            var model = new ProductDetailDto
            {
                Name = "Updated Product",
                Price = 150,
                Photo = "old-image.jpg",
                PhotoUpload = mockFile.Object,
                BrandId = 1,
                CategoryId = 1,
                StatusProduct = "in stock"
            };
            var currentUserId = "admin123";

            _productRepoMock.Setup(repo => repo.CheckIfProductExistsAsync(It.IsAny<Product>()))
                .ReturnsAsync(false);
            _adminRepoMock.Setup(repo => repo.GetAdminFullNameAsync(currentUserId))
                .ReturnsAsync("Admin User");
            _cloudinaryServiceMock.Setup(s => s.ChangeImageAsync(It.IsAny<string>(), It.IsAny<IFormFile>(), It.IsAny<string>()))
                .ReturnsAsync("new-image.jpg");
            _productRepoMock.Setup(repo => repo.UpdateProductAsync(It.IsAny<Product>()))
                .ReturnsAsync((true, "Success"));

            // Act
            var result = await _productService.UpdateProductAsync(productId, model, currentUserId);

            // Assert
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Product updated successfully");
            _cloudinaryServiceMock.Verify(s => s.ChangeImageAsync(It.IsAny<string>(), It.IsAny<IFormFile>(), It.IsAny<string>()), Times.Once);
        }

        // --------------------------------------------------------------------
        // DELETE PRODUCT TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task DeleteProductAsync_Success_ReturnsSuccess()
        {
            // Arrange
            var productId = 1;

            _productRepoMock.Setup(repo => repo.DeleteProductAsync(productId))
                .ReturnsAsync((true, "Deleted successfully"));

            // Act
            var result = await _productService.DeleteProductAsync(productId);

            // Assert
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Product deleted successfully");
        }

        [Fact]
        public async Task DeleteProductAsync_Failure_ReturnsFailure()
        {
            // Arrange
            var productId = 1;

            _productRepoMock.Setup(repo => repo.DeleteProductAsync(productId))
                .ReturnsAsync((false, "Product not found"));

            // Act
            var result = await _productService.DeleteProductAsync(productId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Product not found");
        }

        // --------------------------------------------------------------------
        // UPDATE PRODUCT COLORS TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task UpdateProductColorsAsync_AddNewColor_Success()
        {
            // Arrange
            var productId = 1;
            var model = new List<ProductColorDto>
            {
                new ProductColorDto { ColorId = 0, ColorName = "Blue", ColorCode = "#0000FF" }
            };
            var currentUserId = "admin123";

            _productRepoMock.Setup(repo => repo.GetColorAsync(productId))
                .ReturnsAsync(new List<ProductColor>());
            _productRepoMock.Setup(repo => repo.AddColorAsync(It.IsAny<ProductColor>()))
                .Returns(Task.CompletedTask);
            _productRepoMock.Setup(repo => repo.SaveColorsAsync())
                .ReturnsAsync(true);

            // Act
            var result = await _productService.UpdateProductColorsAsync(productId, model, currentUserId);

            // Assert
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Colors updated successfully.");
            _productRepoMock.Verify(repo => repo.AddColorAsync(It.IsAny<ProductColor>()), Times.Once);
        }

        [Fact]
        public async Task UpdateProductColorsAsync_DeleteRemovedColors_Success()
        {
            // Arrange
            var productId = 1;
            var model = new List<ProductColorDto>
            {
                new ProductColorDto { ColorId = 1, ColorName = "Red", ColorCode = "#FF0000" }
            };
            var currentUserId = "admin123";

            var existingColors = new List<ProductColor>
            {
                new ProductColor { ColorId = 1, ColorName = "Red", ColorCode = "#FF0000" },
                new ProductColor { ColorId = 2, ColorName = "Blue", ColorCode = "#0000FF" }
            };

            _productRepoMock.Setup(repo => repo.GetColorAsync(productId))
                .ReturnsAsync(existingColors);
            _productRepoMock.Setup(repo => repo.DeleteColorsAsync(It.IsAny<List<int>>()))
                .Returns(Task.CompletedTask);
            _productRepoMock.Setup(repo => repo.SaveColorsAsync())
                .ReturnsAsync(true);

            // Act
            var result = await _productService.UpdateProductColorsAsync(productId, model, currentUserId);

            // Assert
            result.Success.Should().BeTrue();
            _productRepoMock.Verify(repo => repo.DeleteColorsAsync(It.Is<List<int>>(list => list.Contains(2))), Times.Once);
        }

        // --------------------------------------------------------------------
        // UPDATE PRODUCT SPECIFICATIONS TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task UpdateProductSpecificationAsync_AddNewSpec_Success()
        {
            // Arrange
            var productId = 1;
            var model = new List<SpecificationDto>
            {
                new() { SpecId = 0, SpecName = "RAM", Detail = "16GB" }
            };
            var currentUserId = "admin123";

            _productRepoMock.Setup(repo => repo.GetSpecificationAsync(productId))
                .ReturnsAsync(new List<Specification>());
            _productRepoMock.Setup(repo => repo.AddSpecificationAsync(It.IsAny<Specification>()))
                .Returns(Task.CompletedTask);
            _productRepoMock.Setup(repo => repo.SaveSpecificationsAsync())
                .ReturnsAsync(true);

            // Act
            var result = await _productService.UpdateProductSpecificationAsync(productId, model, currentUserId);

            // Assert
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Specifications updated successfully.");
            _productRepoMock.Verify(repo => repo.AddSpecificationAsync(It.IsAny<Specification>()), Times.Once);
        }

        [Fact]
        public async Task UpdateProductSpecificationAsync_UpdateExistingSpec_Success()
        {
            // Arrange
            var productId = 1;
            var model = new List<SpecificationDto>
            {
                new() { SpecId = 1, SpecName = "RAM", Detail = "32GB" }
            };
            var currentUserId = "admin123";

            var existingSpecs = new List<Specification>
            {
                new() { SpecId = 1, SpecName = "RAM", Detail = "16GB", ProductId = productId }
            };

            _productRepoMock.Setup(repo => repo.GetSpecificationAsync(productId))
                .ReturnsAsync(existingSpecs);
            _productRepoMock.Setup(repo => repo.SaveSpecificationsAsync())
                .ReturnsAsync(true);

            // Act
            var result = await _productService.UpdateProductSpecificationAsync(productId, model, currentUserId);

            // Assert
            result.Success.Should().BeTrue();
            existingSpecs[0].Detail.Should().Be("32GB");
        }
    }

    // Helper classes for async queryable support in unit tests
    internal class TestAsyncQueryProvider<TEntity> : IAsyncQueryProvider
    {
        private readonly IQueryProvider _inner;

        internal TestAsyncQueryProvider(IQueryProvider inner)
        {
            _inner = inner;
        }

        public IQueryable CreateQuery(System.Linq.Expressions.Expression expression)
        {
            return new TestAsyncEnumerable<TEntity>(expression);
        }

        public IQueryable<TElement> CreateQuery<TElement>(System.Linq.Expressions.Expression expression)
        {
            return new TestAsyncEnumerable<TElement>(expression);
        }

        public object Execute(System.Linq.Expressions.Expression expression)
        {
            return _inner.Execute(expression)!;
        }

        public TResult Execute<TResult>(System.Linq.Expressions.Expression expression)
        {
            return _inner.Execute<TResult>(expression);
        }

        public IAsyncEnumerable<TResult> ExecuteAsync<TResult>(System.Linq.Expressions.Expression expression)
        {
            return new TestAsyncEnumerable<TResult>(expression);
        }

        public TResult ExecuteAsync<TResult>(System.Linq.Expressions.Expression expression, CancellationToken cancellationToken)
        {
            var expectedResultType = typeof(TResult).GetGenericArguments()[0];
            var executionResult = typeof(IQueryProvider)
                .GetMethod(
                    name: nameof(IQueryProvider.Execute),
                    genericParameterCount: 1,
                    types: new[] { typeof(System.Linq.Expressions.Expression) })!
                .MakeGenericMethod(expectedResultType)
                .Invoke(this, new[] { expression });

            return (TResult)typeof(Task).GetMethod(nameof(Task.FromResult))!
                .MakeGenericMethod(expectedResultType)
                .Invoke(null, new[] { executionResult })!;
        }
    }

    internal class TestAsyncEnumerable<T> : EnumerableQuery<T>, IAsyncEnumerable<T>, IQueryable<T>
    {
        public TestAsyncEnumerable(IEnumerable<T> enumerable)
            : base(enumerable)
        { }

        public TestAsyncEnumerable(System.Linq.Expressions.Expression expression)
            : base(expression)
        { }

        public IAsyncEnumerator<T> GetAsyncEnumerator(CancellationToken cancellationToken = default)
        {
            return new TestAsyncEnumerator<T>(this.AsEnumerable().GetEnumerator());
        }

        IQueryProvider IQueryable.Provider => new TestAsyncQueryProvider<T>(this);
    }

    internal class TestAsyncEnumerator<T> : IAsyncEnumerator<T>
    {
        private readonly IEnumerator<T> _inner;

        public TestAsyncEnumerator(IEnumerator<T> inner)
        {
            _inner = inner;
        }

        public ValueTask<bool> MoveNextAsync()
        {
            return new ValueTask<bool>(_inner.MoveNext());
        }

        public T Current => _inner.Current;

        public ValueTask DisposeAsync()
        {
            _inner.Dispose();
            return default;
        }
    }
}
