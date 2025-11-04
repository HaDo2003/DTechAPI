using AutoMapper;
using DTech.Application.DTOs.request;
using DTech.Application.Services;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using FluentAssertions;
using Moq;
using Xunit;

namespace DTech.UnitTest.Services
{
    public class CartServiceTests
    {
        private readonly Mock<ICustomerRepository> _customerRepoMock;
        private readonly Mock<ICartRepository> _cartRepoMock;
        private readonly Mock<IProductRepository> _productRepoMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly CartService _cartService;

        public CartServiceTests()
        {
            _customerRepoMock = new Mock<ICustomerRepository>();
            _productRepoMock = new Mock<IProductRepository>();
            _cartRepoMock = new Mock<ICartRepository>();
            _mapperMock = new Mock<IMapper>();

            _cartService = new CartService(
                _customerRepoMock.Object,
                _cartRepoMock.Object,
                _productRepoMock.Object,
                _mapperMock.Object
            );
        }

        // --------------------------------------------------------------------
        // ADD TO CART TESTS
        // --------------------------------------------------------------------

        [Fact]
        public async Task AddToCartAsync_CustomerNotFound_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var cartProductDto = new CartProductDto
            {
                ProductId = 1,
                Quantity = 2,
                ColorId = 1
            };

            _customerRepoMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(false);

            // Act
            var result = await _cartService.AddToCartAsync(customerId, cartProductDto);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Customer not found");
            _productRepoMock.Verify(repo => repo.CheckProductByIdAsync(It.IsAny<int>()), Times.Never);
        }

        [Fact]
        public async Task AddToCartAsync_ProductNotFound_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var cartProductDto = new CartProductDto
            {
                ProductId = 50,
                Quantity = 2,
                ColorId = 1
            };

            _customerRepoMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _productRepoMock.Setup(repo => repo.CheckProductByIdAsync(cartProductDto.ProductId))
                .ReturnsAsync(false);

            // Act
            var result = await _cartService.AddToCartAsync(customerId, cartProductDto);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Product not found");
            _cartRepoMock.Verify(repo => repo.GetCartByUserIdAsync(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task AddToCartAsync_CartNotFound_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var cartProductDto = new CartProductDto
            {
                ProductId = 1,
                Quantity = 2,
                ColorId = 1
            };

            _customerRepoMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _productRepoMock.Setup(repo => repo.CheckProductByIdAsync(cartProductDto.ProductId))
                .ReturnsAsync(true);
            _cartRepoMock.Setup(repo => repo.GetCartByUserIdAsync(customerId))
                .ReturnsAsync(0);

            // Act
            var result = await _cartService.AddToCartAsync(customerId, cartProductDto);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Cart not found");
        }

        [Fact]
        public async Task AddToCartAsync_NewProduct_AddsSuccessfully()
        {
            // Arrange
            var customerId = "customer123";
            var cartId = 1;
            var cartProductDto = new CartProductDto
            {
                ProductId = 31,
                Quantity = 2,
                ColorId = 3
            };

            var cartProduct = new CartProduct
            {
                ProductId = cartProductDto.ProductId,
                Quantity = cartProductDto.Quantity,
                ColorId = cartProductDto.ColorId
            };

            _customerRepoMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _productRepoMock.Setup(repo => repo.CheckProductByIdAsync(cartProductDto.ProductId))
                .ReturnsAsync(true);
            _cartRepoMock.Setup(repo => repo.GetCartByUserIdAsync(customerId))
                .ReturnsAsync(cartId);
            _cartRepoMock.Setup(repo => repo.CheckProductInCartAsync(cartId, cartProductDto.ProductId, cartProductDto.ColorId))
                .ReturnsAsync((CartProduct?)null);
            _mapperMock.Setup(mapper => mapper.Map<CartProduct>(cartProductDto))
                .Returns(cartProduct);
            _cartRepoMock.Setup(repo => repo.AddToCartAsync(It.IsAny<CartProduct>()))
                .ReturnsAsync(true);

            // Act
            var result = await _cartService.AddToCartAsync(customerId, cartProductDto);

            // Assert
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Added to Cart");
            _cartRepoMock.Verify(repo => repo.AddToCartAsync(It.Is<CartProduct>(cp =>
                cp.CartId == cartId &&
                cp.ProductId == cartProductDto.ProductId &&
                cp.Quantity == cartProductDto.Quantity &&
                cp.ColorId == cartProductDto.ColorId
            )), Times.Once);
        }

        [Fact]
        public async Task AddToCartAsync_NewProduct_FailsToAdd_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var cartId = 1;
            var cartProductDto = new CartProductDto
            {
                ProductId = 1,
                Quantity = 2,
                ColorId = 1
            };

            var cartProduct = new CartProduct
            {
                ProductId = cartProductDto.ProductId,
                Quantity = cartProductDto.Quantity,
                ColorId = cartProductDto.ColorId
            };

            _customerRepoMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _productRepoMock.Setup(repo => repo.CheckProductByIdAsync(cartProductDto.ProductId))
                .ReturnsAsync(true);
            _cartRepoMock.Setup(repo => repo.GetCartByUserIdAsync(customerId))
                .ReturnsAsync(cartId);
            _cartRepoMock.Setup(repo => repo.CheckProductInCartAsync(cartId, cartProductDto.ProductId, cartProductDto.ColorId))
                .ReturnsAsync((CartProduct?)null);
            _mapperMock.Setup(mapper => mapper.Map<CartProduct>(cartProductDto))
                .Returns(cartProduct);
            _cartRepoMock.Setup(repo => repo.AddToCartAsync(It.IsAny<CartProduct>()))
                .ReturnsAsync(false);

            // Act
            var result = await _cartService.AddToCartAsync(customerId, cartProductDto);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Failed to add to cart");
        }

        [Fact]
        public async Task AddToCartAsync_ExistingProduct_UpdatesQuantitySuccessfully()
        {
            // Arrange
            var customerId = "customer123";
            var cartId = 1;
            var existingCartProductId = 10;
            var cartProductDto = new CartProductDto
            {
                ProductId = 31,
                Quantity = 3,
                ColorId = 3
            };

            var existingCartProduct = new CartProduct
            {
                Id = existingCartProductId,
                CartId = cartId,
                ProductId = cartProductDto.ProductId,
                ColorId = cartProductDto.ColorId,
                Quantity = 2
            };

            _customerRepoMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _productRepoMock.Setup(repo => repo.CheckProductByIdAsync(cartProductDto.ProductId))
                .ReturnsAsync(true);
            _cartRepoMock.Setup(repo => repo.GetCartByUserIdAsync(customerId))
                .ReturnsAsync(cartId);
            _cartRepoMock.Setup(repo => repo.CheckProductInCartAsync(cartId, cartProductDto.ProductId, cartProductDto.ColorId))
                .ReturnsAsync(existingCartProduct);
            _cartRepoMock.Setup(repo => repo.UpdateCartProductAsync(existingCartProductId, customerId, cartProductDto.Quantity))
                .ReturnsAsync(true);

            // Act
            var result = await _cartService.AddToCartAsync(customerId, cartProductDto);

            // Assert
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Updated product quantity in cart");
            _cartRepoMock.Verify(repo => repo.UpdateCartProductAsync(existingCartProductId, customerId, cartProductDto.Quantity), Times.Once);
            _cartRepoMock.Verify(repo => repo.AddToCartAsync(It.IsAny<CartProduct>()), Times.Never);
        }

        [Fact]
        public async Task AddToCartAsync_ExistingProduct_FailsToUpdate_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var cartId = 1;
            var existingCartProductId = 10;
            var cartProductDto = new CartProductDto
            {
                ProductId = 1,
                Quantity = 3,
                ColorId = 1
            };

            var existingCartProduct = new CartProduct
            {
                Id = existingCartProductId,
                CartId = cartId,
                ProductId = cartProductDto.ProductId,
                ColorId = cartProductDto.ColorId,
                Quantity = 2
            };

            _customerRepoMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _productRepoMock.Setup(repo => repo.CheckProductByIdAsync(cartProductDto.ProductId))
                .ReturnsAsync(true);
            _cartRepoMock.Setup(repo => repo.GetCartByUserIdAsync(customerId))
                .ReturnsAsync(cartId);
            _cartRepoMock.Setup(repo => repo.CheckProductInCartAsync(cartId, cartProductDto.ProductId, cartProductDto.ColorId))
                .ReturnsAsync(existingCartProduct);
            _cartRepoMock.Setup(repo => repo.UpdateCartProductAsync(existingCartProductId, customerId, cartProductDto.Quantity))
                .ReturnsAsync(false);

            // Act
            var result = await _cartService.AddToCartAsync(customerId, cartProductDto);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Failed to update cart product quantity");
        }

        // --------------------------------------------------------------------
        // GET CART TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task GetCartAsync_CustomerNotFound_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            _customerRepoMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(false);
            // Act
            var result = await _cartService.GetCartAsync(customerId);
            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Customer not found");
            _cartRepoMock.Verify(repo => repo.GetFullCartByUserIdAsync(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetCartAsync_CartNotFound_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            _customerRepoMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _cartRepoMock.Setup(repo => repo.GetFullCartByUserIdAsync(customerId))
                .ReturnsAsync((Cart?)null);
            // Act
            var result = await _cartService.GetCartAsync(customerId);
            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Cart not found");
        }

        [Fact]
        public async Task GetCartAsync_Success_ReturnsCart()
        {
            // Arrange
            var customerId = "customer123";
            var cartId = 1;

            var product1 = new Product
            {
                ProductId = 1,
                Name = "Product 1",
                Price = 100,
                Discount = 10,
                PriceAfterDiscount = 90,
                Photo = "photo1.jpg"
            };

            var product2 = new Product
            {
                ProductId = 2,
                Name = "Product 2",
                Price = 200,
                Discount = 20,
                PriceAfterDiscount = 160,
                Photo = "photo2.jpg"
            };

            var cartProducts = new List<CartProduct>
            {
                new CartProduct
                {
                    Id = 1,
                    CartId = cartId,
                    ProductId = 1,
                    Quantity = 2,
                    ColorId = 1,
                    Product = product1,
                    ProductColor = new ProductColor
                    {
                        ColorId = 1,
                        ColorName = "Red",
                        ColorCode = "#FF0000"
                    }
                },
                new CartProduct
                {
                    Id = 2,
                    CartId = cartId,
                    ProductId = 2,
                    Quantity = 1,
                    ColorId = 2,
                    Product = product2,
                    ProductColor = new ProductColor
                    {
                        ColorId = 2,
                        ColorName = "Blue",
                        ColorCode = "#0000FF"
                    }
                }
            };

            var cart = new Cart
            {
                CartId = cartId,
                CustomerId = customerId,
                CartProducts = cartProducts
            };

            _customerRepoMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _cartRepoMock.Setup(repo => repo.GetFullCartByUserIdAsync(customerId))
                .ReturnsAsync(cart);

            // Act
            var result = await _cartService.GetCartAsync(customerId);

            // Assert
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Cart retrieved successfully");
            result.CartId.Should().Be(cartId);
            result.CustomerId.Should().Be(customerId);
            result.CartProducts.Should().HaveCount(2);

            // Verify first product
            var firstProduct = result.CartProducts.ElementAt(0);
            firstProduct.Id.Should().Be(1);
            firstProduct.ProductId.Should().Be(1);
            firstProduct.Quantity.Should().Be(2);
            firstProduct.Name.Should().Be("Product 1");
            firstProduct.Price.Should().Be(100);
            firstProduct.Discount.Should().Be(10);
            firstProduct.PriceAfterDiscount.Should().Be(90);
            firstProduct.Photo.Should().Be("photo1.jpg");
            firstProduct.Color.Should().NotBeNull();
            firstProduct.Color!.ColorId.Should().Be(1);
            firstProduct.Color.ColorName.Should().Be("Red");
            firstProduct.Color.ColorCode.Should().Be("#FF0000");

            // Verify second product
            var secondProduct = result.CartProducts.ElementAt(1);
            secondProduct.Id.Should().Be(2);
            secondProduct.ProductId.Should().Be(2);
            secondProduct.Quantity.Should().Be(1);
            secondProduct.Name.Should().Be("Product 2");
            secondProduct.Price.Should().Be(200);
            secondProduct.Discount.Should().Be(20);
            secondProduct.PriceAfterDiscount.Should().Be(160);
            secondProduct.Photo.Should().Be("photo2.jpg");
            secondProduct.Color.Should().NotBeNull();
            secondProduct.Color!.ColorId.Should().Be(2);
            secondProduct.Color.ColorName.Should().Be("Blue");
            secondProduct.Color.ColorCode.Should().Be("#0000FF");
        }

        // --------------------------------------------------------------------
        // UPDATE QUANTITY TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task UpdateQuantityAsync_CustomerNotFound_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var cartProductId = 1;
            var newQuantity = 5;
            _customerRepoMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(false);
            // Act
            var result = await _cartService.UpdateQuantityAsync(customerId, cartProductId, newQuantity);
            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Customer not found");
            _cartRepoMock.Verify(repo => repo.UpdateCartProductAsync(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<int>()), Times.Never);
        }

        [Fact]
        public async Task UpdateQuantityAsync_Failure_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var cartProductId = 1;
            var newQuantity = 5;
            _customerRepoMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _cartRepoMock.Setup(repo => repo.UpdateCartProductAsync(cartProductId, customerId, newQuantity))
                .ReturnsAsync(false);
            // Act
            var result = await _cartService.UpdateQuantityAsync(customerId, cartProductId, newQuantity);
            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Update quantity failed");
        }

        [Fact]
        public async Task UpdateQuantityAsync_Success_ReturnsSuccess()
        {
            // Arrange
            var customerId = "customer123";
            var cartProductId = 1;
            var newQuantity = 5;
            var cartId = 1;

            var product = new Product
            {
                ProductId = 1,
                Name = "Product 1",
                Price = 100,
                Discount = 10,
                PriceAfterDiscount = 90,
                Photo = "photo1.jpg"
            };

            var cartProducts = new List<CartProduct>
            {
                new CartProduct
                {
                    Id = cartProductId,
                    CartId = cartId,
                    ProductId = 1,
                    Quantity = newQuantity,
                    ColorId = 1,
                    Product = product,
                    ProductColor = new ProductColor
                    {
                        ColorId = 1,
                        ColorName = "Red",
                        ColorCode = "#FF0000"
                    }
                }
            };

            var cart = new Cart
            {
                CartId = cartId,
                CustomerId = customerId,
                CartProducts = cartProducts
            };

            _customerRepoMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _cartRepoMock.Setup(repo => repo.UpdateCartProductAsync(cartProductId, customerId, newQuantity))
                .ReturnsAsync(true);
            _cartRepoMock.Setup(repo => repo.GetFullCartByUserIdAsync(customerId))
                .ReturnsAsync(cart);

            // Act
            var result = await _cartService.UpdateQuantityAsync(customerId, cartProductId, newQuantity);

            // Assert
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Cart retrieved successfully");
            result.CartProducts.Should().HaveCount(1);
            result.CartProducts.First().Quantity.Should().Be(newQuantity);
        }
    }
}
