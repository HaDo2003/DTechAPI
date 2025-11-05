using AutoMapper;
using DTech.Application.DTOs.request;
using DTech.Application.DTOs.response;
using DTech.Application.Interfaces;
using DTech.Application.Services;
using DTech.Domain.Entities;
using DTech.Domain.Enums;
using DTech.Domain.Interfaces;
using FluentAssertions;
using Moq;
using Xunit;

namespace DTech.UnitTest.Services
{
    public class CheckOutServiceTests
    {
        private readonly Mock<ICustomerRepository> _customerRepoMock;
        private readonly Mock<IOrderRepository> _orderRepoMock;
        private readonly Mock<ICartRepository> _cartRepoMock;
        private readonly Mock<IPaymentMethodRepository> _paymentMethodRepoMock;
        private readonly Mock<ICouponRepository> _couponRepoMock;
        private readonly Mock<IProductRepository> _productRepoMock;
        private readonly Mock<IShippingRepository> _shippingRepoMock;
        private readonly Mock<IPaymentRepository> _paymentRepoMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<IBackgroundTaskQueue> _backgroundTaskQueueMock;
        private readonly Mock<IEmailService> _emailServiceMock;
        private readonly CheckOutService _checkOutService;

        public CheckOutServiceTests()
        {
            _customerRepoMock = new Mock<ICustomerRepository>();
            _orderRepoMock = new Mock<IOrderRepository>();
            _cartRepoMock = new Mock<ICartRepository>();
            _paymentMethodRepoMock = new Mock<IPaymentMethodRepository>();
            _couponRepoMock = new Mock<ICouponRepository>();
            _productRepoMock = new Mock<IProductRepository>();
            _shippingRepoMock = new Mock<IShippingRepository>();
            _paymentRepoMock = new Mock<IPaymentRepository>();
            _mapperMock = new Mock<IMapper>();
            _backgroundTaskQueueMock = new Mock<IBackgroundTaskQueue>();
            _emailServiceMock = new Mock<IEmailService>();

            _checkOutService = new CheckOutService(
                _customerRepoMock.Object,
                _orderRepoMock.Object,
                _cartRepoMock.Object,
                _paymentMethodRepoMock.Object,
                _couponRepoMock.Object,
                _productRepoMock.Object,
                _shippingRepoMock.Object,
                _paymentRepoMock.Object,
                _mapperMock.Object,
                _backgroundTaskQueueMock.Object,
                _emailServiceMock.Object
            );
        }

        // --------------------------------------------------------------------
        // GET CHECKOUT TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task GetCheckOutAsync_CustomerNotFound_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";

            _customerRepoMock.Setup(repo => repo.GetCustomerByIdAsync(customerId))
                .ReturnsAsync((ApplicationUser?)null!);

            // Act
            var result = await _checkOutService.GetCheckOutAsync(customerId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Customer not found");
            _cartRepoMock.Verify(repo => repo.GetFullCartByUserIdAsync(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetCheckOutAsync_CartNotFound_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var customer = new ApplicationUser
            {
                Id = customerId,
                Email = "test@example.com",
                FullName = "John Doe"
            };

            _customerRepoMock.Setup(repo => repo.GetCustomerByIdAsync(customerId))
                .ReturnsAsync(customer);
            _cartRepoMock.Setup(repo => repo.GetFullCartByUserIdAsync(customerId))
                .ReturnsAsync((Cart?)null);

            // Act
            var result = await _checkOutService.GetCheckOutAsync(customerId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Cart not found");
        }

        [Fact]
        public async Task GetCheckOutAsync_EmptyCart_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var customer = new ApplicationUser
            {
                Id = customerId,
                Email = "test@example.com",
                FullName = "John Doe"
            };

            var emptyCart = new Cart
            {
                CartId = 1,
                CustomerId = customerId,
                CartProducts = new List<CartProduct>()
            };

            _customerRepoMock.Setup(repo => repo.GetCustomerByIdAsync(customerId))
                .ReturnsAsync(customer);
            _cartRepoMock.Setup(repo => repo.GetFullCartByUserIdAsync(customerId))
                .ReturnsAsync(emptyCart);

            // Act
            var result = await _checkOutService.GetCheckOutAsync(customerId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Cart not found");
        }

        [Fact]
        public async Task GetCheckOutAsync_Success_ReturnsCheckoutDetails()
        {
            // Arrange
            var customerId = "customer123";
            var customer = new ApplicationUser
            {
                Id = customerId,
                Email = "test@example.com",
                FullName = "John Doe"
            };

            var product = new Product
            {
                ProductId = 1,
                Name = "Product 1",
                Price = 100,
                PriceAfterDiscount = 90,
                Photo = "photo1.jpg"
            };

            var cart = new Cart
            {
                CartId = 1,
                CustomerId = customerId,
                CartProducts = new List<CartProduct>
                {
                    new CartProduct
                    {
                        Id = 1,
                        ProductId = 1,
                        Quantity = 2,
                        Product = product,
                        ProductColor = new ProductColor
                        {
                            ColorId = 1,
                            ColorName = "Red",
                            ColorCode = "#FF0000"
                        }
                    }
                }
            };

            var customerAddresses = new List<CustomerAddress>
            {
                new CustomerAddress
                {
                    AddressId = 1,
                    FullName = "John Doe",
                    PhoneNumber = "1234567890",
                    Address = "123 Main St",
                    IsDefault = true
                }
            };

            var paymentMethods = new List<PaymentMethod>
            {
                new() { PaymentMethodId = 1, Description = "Credit Card" },
                new() { PaymentMethodId = 2, Description = "Cash on Delivery" }
            };

            var addressDtos = new List<CustomerAddressDto>
            {
                new() {
                    AddressId = 1,
                    FullName = "John Doe",
                    PhoneNumber = "1234567890",
                    Address = "123 Main St"
                }
            };

            var paymentMethodDtos = new List<PaymentMethodDto>
            {
                new PaymentMethodDto { PaymentMethodId = 1, Description = "Credit Card" },
                new PaymentMethodDto { PaymentMethodId = 2, Description = "Cash on Delivery" }
            };

            _customerRepoMock.Setup(repo => repo.GetCustomerByIdAsync(customerId))
                .ReturnsAsync(customer);
            _cartRepoMock.Setup(repo => repo.GetFullCartByUserIdAsync(customerId))
                .ReturnsAsync(cart);
            _customerRepoMock.Setup(repo => repo.GetAllAddressesByCustomerIdAsync(customerId))
                .ReturnsAsync(customerAddresses);
            _customerRepoMock.Setup(repo => repo.GetDefaultAddressByCustomerIdAsync(customerId))
                .ReturnsAsync(customerAddresses[0]);
            _paymentMethodRepoMock.Setup(repo => repo.GetListAsync())
                .ReturnsAsync(paymentMethods);
            _mapperMock.Setup(m => m.Map<List<CustomerAddressDto>>(customerAddresses))
                .Returns(addressDtos);
            _mapperMock.Setup(m => m.Map<List<PaymentMethodDto>>(paymentMethods))
                .Returns(paymentMethodDtos);

            // Act
            var result = await _checkOutService.GetCheckOutAsync(customerId);

            // Assert
            result.Success.Should().BeTrue();
            result.Email.Should().Be("test@example.com");
            result.BillingName.Should().Be("John Doe");
            result.BillingPhone.Should().Be("1234567890");
            result.BillingAddress.Should().Be("123 Main St");
            result.OrderSummary.Should().NotBeNull();
            result.OrderSummary.SubTotal.Should().Be(180); // 90 * 2
            result.OrderSummary.ShippingFee.Should().Be(10);
            result.OrderSummary.Total.Should().Be(190);
        }

        // --------------------------------------------------------------------
        // BUY NOW TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task BuyNowAsync_CustomerNotFound_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var buyNowDto = new BuyNowReqDto
            {
                ProductId = 1,
                Quantity = 2,
                ColorId = 1
            };

            _customerRepoMock.Setup(repo => repo.GetCustomerByIdAsync(customerId))
                .ReturnsAsync((ApplicationUser?)null!);

            // Act
            var result = await _checkOutService.BuyNowAsync(customerId, buyNowDto);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Customer not found");
            _productRepoMock.Verify(repo => repo.GetProductByIdAsync(It.IsAny<int>()), Times.Never);
        }

        [Fact]
        public async Task BuyNowAsync_ProductNotFound_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var customer = new ApplicationUser
            {
                Id = customerId,
                Email = "test@example.com"
            };

            var buyNowDto = new BuyNowReqDto
            {
                ProductId = 1,
                Quantity = 2,
                ColorId = 1
            };

            _customerRepoMock.Setup(repo => repo.GetCustomerByIdAsync(customerId))
                .ReturnsAsync(customer);
            _productRepoMock.Setup(repo => repo.GetProductByIdAsync(buyNowDto.ProductId))
                .ReturnsAsync((Product?)null);

            // Act
            var result = await _checkOutService.BuyNowAsync(customerId, buyNowDto);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Product not found");
        }

        [Fact]
        public async Task BuyNowAsync_Success_ReturnsCheckoutDetails()
        {
            // Arrange
            var customerId = "customer123";
            var customer = new ApplicationUser
            {
                Id = customerId,
                Email = "test@example.com",
                FullName = "John Doe"
            };

            var product = new Product
            {
                ProductId = 1,
                Name = "Product 1",
                Price = 100,
                PriceAfterDiscount = 90,
                Photo = "photo1.jpg",
                ProductColors = new List<ProductColor>
                {
                    new ProductColor
                    {
                        ColorId = 1,
                        ColorName = "Red",
                        ColorCode = "#FF0000"
                    }
                }
            };

            var buyNowDto = new BuyNowReqDto
            {
                ProductId = 1,
                Quantity = 2,
                ColorId = 1
            };

            var customerAddresses = new List<CustomerAddress>();
            var paymentMethods = new List<PaymentMethod>();
            var addressDtos = new List<CustomerAddressDto>();
            var paymentMethodDtos = new List<PaymentMethodDto>();

            _customerRepoMock.Setup(repo => repo.GetCustomerByIdAsync(customerId))
                .ReturnsAsync(customer);
            _productRepoMock.Setup(repo => repo.GetProductByIdAsync(buyNowDto.ProductId))
                .ReturnsAsync(product);
            _customerRepoMock.Setup(repo => repo.GetAllAddressesByCustomerIdAsync(customerId))
                .ReturnsAsync(customerAddresses);
            _customerRepoMock.Setup(repo => repo.GetDefaultAddressByCustomerIdAsync(customerId))
                .ReturnsAsync((CustomerAddress?)null);
            _paymentMethodRepoMock.Setup(repo => repo.GetListAsync())
                .ReturnsAsync(paymentMethods);
            _mapperMock.Setup(m => m.Map<List<CustomerAddressDto>>(customerAddresses))
                .Returns(addressDtos);
            _mapperMock.Setup(m => m.Map<List<PaymentMethodDto>>(paymentMethods))
                .Returns(paymentMethodDtos);

            // Act
            var result = await _checkOutService.BuyNowAsync(customerId, buyNowDto);

            // Assert
            result.Success.Should().BeTrue();
            result.Email.Should().Be("test@example.com");
            result.OrderSummary.Should().NotBeNull();
            result.OrderSummary.SubTotal.Should().Be(180); // 90 * 2
            result.OrderSummary.Items.Should().HaveCount(1);
            result.OrderSummary.Items[0].Name.Should().Be("Product 1");
        }

        // --------------------------------------------------------------------
        // APPLY COUPON TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task ApplyCouponAsync_CustomerNotFound_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var code = "DISCOUNT10";

            _customerRepoMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(false);

            // Act
            var result = await _checkOutService.ApplyCouponAsync(code, customerId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Customer not found");
        }

        [Fact]
        public async Task ApplyCouponAsync_EmptyCart_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var code = "DISCOUNT10";

            _customerRepoMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _cartRepoMock.Setup(repo => repo.GetFullCartByUserIdAsync(customerId))
                .ReturnsAsync((Cart?)null);

            // Act
            var result = await _checkOutService.ApplyCouponAsync(code, customerId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Cart not found");
        }

        [Fact]
        public async Task ApplyCouponAsync_CouponNotFound_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var code = "INVALID";
            var customer = new ApplicationUser { Id = customerId };

            var product = new Product
            {
                ProductId = 1,
                PriceAfterDiscount = 100
            };

            var cart = new Cart
            {
                CartId = 1,
                CustomerId = customerId,
                CartProducts = new List<CartProduct>
                {
                    new CartProduct
                    {
                        ProductId = 1,
                        Quantity = 2,
                        Product = product
                    }
                }
            };

            _customerRepoMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _cartRepoMock.Setup(repo => repo.GetFullCartByUserIdAsync(customerId))
                .ReturnsAsync(cart);
            _customerRepoMock.Setup(repo => repo.GetCustomerByIdAsync(customerId))
                .ReturnsAsync(customer);
            _couponRepoMock.Setup(repo => repo.GetCouponByCode(code))
                .ReturnsAsync((Coupon?)null);

            // Act
            var result = await _checkOutService.ApplyCouponAsync(code, customerId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Coupon does not exist or has expired");
        }

        [Fact]
        public async Task ApplyCouponAsync_CouponAlreadyUsed_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var code = "USED10";
            var customer = new ApplicationUser { Id = customerId };

            var product = new Product
            {
                ProductId = 1,
                PriceAfterDiscount = 100
            };

            var cart = new Cart
            {
                CartId = 1,
                CustomerId = customerId,
                CartProducts = new List<CartProduct>
                {
                    new CartProduct
                    {
                        ProductId = 1,
                        Quantity = 2,
                        Product = product
                    }
                }
            };

            var coupon = new Coupon
            {
                CouponId = 1,
                Code = code,
                Discount = 10,
                DiscountType = "Percentage",
                Condition = 100,
                EndDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(10))
            };

            _customerRepoMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _cartRepoMock.Setup(repo => repo.GetFullCartByUserIdAsync(customerId))
                .ReturnsAsync(cart);
            _customerRepoMock.Setup(repo => repo.GetCustomerByIdAsync(customerId))
                .ReturnsAsync(customer);
            _couponRepoMock.Setup(repo => repo.GetCouponByCode(code))
                .ReturnsAsync(coupon);
            _couponRepoMock.Setup(repo => repo.CheckIsUsedAsync(customerId, coupon.CouponId))
                .ReturnsAsync(true);

            // Act
            var result = await _checkOutService.ApplyCouponAsync(code, customerId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Coupon has been used");
        }

        [Fact]
        public async Task ApplyCouponAsync_OrderBelowMinimum_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var code = "BIG50";
            var customer = new ApplicationUser { Id = customerId };

            var product = new Product
            {
                ProductId = 1,
                PriceAfterDiscount = 30
            };

            var cart = new Cart
            {
                CartId = 1,
                CustomerId = customerId,
                CartProducts = new List<CartProduct>
                {
                    new CartProduct
                    {
                        ProductId = 1,
                        Quantity = 1,
                        Product = product
                    }
                }
            };

            var coupon = new Coupon
            {
                CouponId = 1,
                Code = code,
                Discount = 50,
                DiscountType = "Direct",
                Condition = 100,
                EndDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(10))
            };

            _customerRepoMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _cartRepoMock.Setup(repo => repo.GetFullCartByUserIdAsync(customerId))
                .ReturnsAsync(cart);
            _customerRepoMock.Setup(repo => repo.GetCustomerByIdAsync(customerId))
                .ReturnsAsync(customer);
            _couponRepoMock.Setup(repo => repo.GetCouponByCode(code))
                .ReturnsAsync(coupon);
            _couponRepoMock.Setup(repo => repo.CheckIsUsedAsync(customerId, coupon.CouponId))
                .ReturnsAsync(false);

            // Act
            var result = await _checkOutService.ApplyCouponAsync(code, customerId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Contain("Minimum order value");
        }

        [Fact]
        public async Task ApplyCouponAsync_PercentageDiscount_Success()
        {
            // Arrange
            var customerId = "customer123";
            var code = "PERCENT10";
            var customer = new ApplicationUser { Id = customerId };

            var product = new Product
            {
                ProductId = 1,
                PriceAfterDiscount = 100
            };

            var cart = new Cart
            {
                CartId = 1,
                CustomerId = customerId,
                CartProducts = new List<CartProduct>
                {
                    new CartProduct
                    {
                        ProductId = 1,
                        Quantity = 2,
                        Product = product
                    }
                }
            };

            var coupon = new Coupon
            {
                CouponId = 1,
                Code = code,
                Discount = 10,
                DiscountType = "Percentage",
                Condition = 100,
                MaxDiscount = 50,
                EndDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(10))
            };

            _customerRepoMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _cartRepoMock.Setup(repo => repo.GetFullCartByUserIdAsync(customerId))
                .ReturnsAsync(cart);
            _customerRepoMock.Setup(repo => repo.GetCustomerByIdAsync(customerId))
                .ReturnsAsync(customer);
            _couponRepoMock.Setup(repo => repo.GetCouponByCode(code))
                .ReturnsAsync(coupon);
            _couponRepoMock.Setup(repo => repo.CheckIsUsedAsync(customerId, coupon.CouponId))
                .ReturnsAsync(false);

            // Act
            var result = await _checkOutService.ApplyCouponAsync(code, customerId);

            // Assert
            result.Success.Should().BeTrue();
            result.DiscountAmount.Should().Be(20); // 10% of 200
            result.Total.Should().Be(190); // 200 - 20 + 10 (shipping)
        }

        [Fact]
        public async Task ApplyCouponAsync_DirectDiscount_Success()
        {
            // Arrange
            var customerId = "customer123";
            var code = "DIRECT50";
            var customer = new ApplicationUser { Id = customerId };

            var product = new Product
            {
                ProductId = 1,
                PriceAfterDiscount = 100
            };

            var cart = new Cart
            {
                CartId = 1,
                CustomerId = customerId,
                CartProducts = new List<CartProduct>
                {
                    new CartProduct
                    {
                        ProductId = 1,
                        Quantity = 2,
                        Product = product
                    }
                }
            };

            var coupon = new Coupon
            {
                CouponId = 1,
                Code = code,
                Discount = 50,
                DiscountType = "Direct",
                Condition = 100,
                EndDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(10))
            };

            _customerRepoMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _cartRepoMock.Setup(repo => repo.GetFullCartByUserIdAsync(customerId))
                .ReturnsAsync(cart);
            _customerRepoMock.Setup(repo => repo.GetCustomerByIdAsync(customerId))
                .ReturnsAsync(customer);
            _couponRepoMock.Setup(repo => repo.GetCouponByCode(code))
                .ReturnsAsync(coupon);
            _couponRepoMock.Setup(repo => repo.CheckIsUsedAsync(customerId, coupon.CouponId))
                .ReturnsAsync(false);

            // Act
            var result = await _checkOutService.ApplyCouponAsync(code, customerId);

            // Assert
            result.Success.Should().BeTrue();
            result.DiscountAmount.Should().Be(50);
            result.Total.Should().Be(160); // 200 - 50 + 10 (shipping)
        }

        // --------------------------------------------------------------------
        // APPLY COUPON BUY NOW TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task ApplyCouponBuyNowAsync_ProductNotFound_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var code = "DISCOUNT10";
            var productId = 1;
            var quantity = 2;

            _productRepoMock.Setup(repo => repo.GetProductByIdAsync(productId))
                .ReturnsAsync((Product?)null);

            // Act
            var result = await _checkOutService.ApplyCouponBuyNowAsync(code, customerId, productId, quantity);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Product not found");
        }

        [Fact]
        public async Task ApplyCouponBuyNowAsync_Success_ReturnsDiscountedTotal()
        {
            // Arrange
            var customerId = "customer123";
            var code = "DISCOUNT10";
            var productId = 1;
            var quantity = 2;
            var customer = new ApplicationUser { Id = customerId };

            var product = new Product
            {
                ProductId = productId,
                Price = 100
            };

            var coupon = new Coupon
            {
                CouponId = 1,
                Code = code,
                Discount = 10,
                DiscountType = "Percentage",
                Condition = 100,
                EndDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(10))
            };

            _productRepoMock.Setup(repo => repo.GetProductByIdAsync(productId))
                .ReturnsAsync(product);
            _customerRepoMock.Setup(repo => repo.GetCustomerByIdAsync(customerId))
                .ReturnsAsync(customer);
            _couponRepoMock.Setup(repo => repo.GetCouponByCode(code))
                .ReturnsAsync(coupon);
            _couponRepoMock.Setup(repo => repo.CheckIsUsedAsync(customerId, coupon.CouponId))
                .ReturnsAsync(false);

            // Act
            var result = await _checkOutService.ApplyCouponBuyNowAsync(code, customerId, productId, quantity);

            // Assert
            result.Success.Should().BeTrue();
            result.DiscountAmount.Should().Be(20); // 10% of 200
            result.Total.Should().Be(190); // 200 - 20 + 10
        }
    }
}
