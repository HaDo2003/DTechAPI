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
    public class CustomerServiceTests
    {
        private readonly Mock<ICustomerRepository> _customerRepositoryMock;
        private readonly Mock<IOrderRepository> _orderRepositoryMock;
        private readonly Mock<IProductRepository> _productRepositoryMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<ICloudinaryService> _cloudinaryServiceMock;
        private readonly Mock<IBackgroundTaskQueue> _backgroundTaskQueueMock;
        private readonly Mock<IEmailService> _emailServiceMock;
        private readonly Mock<IUnitOfWorkService> _unitOfWorkService;
        private readonly CustomerService _customerService;
        public CustomerServiceTests()
        {
            _customerRepositoryMock = new Mock<ICustomerRepository>();
            _orderRepositoryMock = new Mock<IOrderRepository>();
            _productRepositoryMock = new Mock<IProductRepository>();
            _mapperMock = new Mock<IMapper>();
            _cloudinaryServiceMock = new Mock<ICloudinaryService>();
            _backgroundTaskQueueMock = new Mock<IBackgroundTaskQueue>();
            _emailServiceMock = new Mock<IEmailService>();
            _unitOfWorkService = new Mock<IUnitOfWorkService>();

            _customerService = new CustomerService(
                _customerRepositoryMock.Object,
                _orderRepositoryMock.Object,
                _productRepositoryMock.Object,
                _mapperMock.Object,
                _cloudinaryServiceMock.Object,
                _backgroundTaskQueueMock.Object,
                _emailServiceMock.Object,
                _unitOfWorkService.Object
            );
        }

        // --------------------------------------------------------------------
        // GET CUSTOMER TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task GetCustomer_InvalidId_ReturnsFalse()
        {
            //Arrange
            var invalidCustomerId = "Invalid";
            _customerRepositoryMock
                .Setup(repo => repo.GetCustomerByIdAsync(It.IsAny<string>()))
                .ReturnsAsync((ApplicationUser?)null!);
            // Act
            var result = await _customerService.GetCustomer(invalidCustomerId);
            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Customer not found");
        }

        [Fact]
        public async Task GetCustomer_ValidId_ReturnsCustomer()
        {
            //Arrange
            var validCustomerId = "Valid";
            var customerEntity = new ApplicationUser { Id = validCustomerId, UserName = "TestUser" };
            var customerDto = new CustomerDto { UserName = "TestUser" };
            _customerRepositoryMock
                .Setup(repo => repo.GetCustomerByIdAsync(validCustomerId))
                .ReturnsAsync(customerEntity);
            _mapperMock
                .Setup(mapper => mapper.Map<CustomerDto>(customerEntity))
                .Returns(customerDto);
            // Act
            var result = await _customerService.GetCustomer(validCustomerId);
            // Assert
            result.Success.Should().BeTrue();
            result.UserName.Should().BeEquivalentTo(customerDto.UserName);
        }

        // --------------------------------------------------------------------
        // UPDATE CUSTOMER PROFILE TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task UpdateCustomerProfile_InvalidId_ReturnsFalse()
        {
            //Arrange
            var invalidCustomerId = "Invalid";
            _customerRepositoryMock
                .Setup(repo => repo.GetCustomerByIdAsync(It.IsAny<string>()))
                .ReturnsAsync((ApplicationUser?)null!);
            // Act
            var result = await _customerService.UpdateCustomerProfile(invalidCustomerId, new UpdateProfileDto());
            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Customer not found");
        }

        [Fact]
        public async Task UpdateCustomerProfile_ExistingEmail_ReturnsFalse()
        {
            //Arrange
            var validCustomerId = "Valid";
            var existingEmail = "existing@example.com";
            var updateProfileDto = new UpdateProfileDto { Email = existingEmail };
            var customerEntity = new ApplicationUser { Id = validCustomerId, Email = "old@example.com" };
            _customerRepositoryMock
                .Setup(repo => repo.GetCustomerByIdAsync(validCustomerId))
                .ReturnsAsync(customerEntity);
            _customerRepositoryMock
                .Setup(repo => repo.CheckEmailAsync(existingEmail, validCustomerId))
                .ReturnsAsync(true);
            // Act
            var result = await _customerService.UpdateCustomerProfile(validCustomerId, updateProfileDto);
            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Email already exists.");
        }

        [Fact]
        public async Task UpdateCustomerProfile_ExistingPhoneNumber_ReturnsFalse()
        {
            //Arrange
            var validCustomerId = "Valid";
            var existingPhoneNumber = "1234567890";
            var updateProfileDto = new UpdateProfileDto { Email = "test@example.com", PhoneNumber = existingPhoneNumber };
            var customerEntity = new ApplicationUser { Id = validCustomerId, Email = "old@example.com" };
            _customerRepositoryMock
                .Setup(repo => repo.GetCustomerByIdAsync(validCustomerId))
                .ReturnsAsync(customerEntity);
            _customerRepositoryMock
                .Setup(repo => repo.CheckEmailAsync(updateProfileDto.Email, validCustomerId))
                .ReturnsAsync(false);
            _customerRepositoryMock
                .Setup(repo => repo.CheckPhoneAsync(existingPhoneNumber, validCustomerId))
                .ReturnsAsync(true);
            // Act
            var result = await _customerService.UpdateCustomerProfile(validCustomerId, updateProfileDto);
            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Phone number already exists.");
        }

        [Fact]
        public async Task UpdateCustomerProfile_ValidData_ReturnsTrue()
        {
            //Arrange
            var validCustomerId = "Valid";
            var updateProfileDto = new UpdateProfileDto { Email = "new@example.com", PhoneNumber = "0987654321" };
            var customerEntity = new ApplicationUser { Id = validCustomerId, Email = "old@example.com" };
            var updatedCustomer = new ApplicationUser { Id = validCustomerId, Email = "new@example.com", PhoneNumber = "0987654321" };
            
            _customerRepositoryMock
                .Setup(repo => repo.GetCustomerByIdAsync(validCustomerId))
                .ReturnsAsync(customerEntity);
            _customerRepositoryMock
                .Setup(repo => repo.CheckEmailAsync(updateProfileDto.Email, validCustomerId))
                .ReturnsAsync(false);
            _customerRepositoryMock
                .Setup(repo => repo.CheckPhoneAsync(updateProfileDto.PhoneNumber, validCustomerId))
                .ReturnsAsync(false);
            _mapperMock
                .Setup(mapper => mapper.Map<ApplicationUser>(updateProfileDto))
                .Returns(updatedCustomer);
            _customerRepositoryMock
                .Setup(repo => repo.UpdateCustomerAsync(It.Is<ApplicationUser>(u => u.Id == validCustomerId)))
                .ReturnsAsync(true);
            // Act
            var result = await _customerService.UpdateCustomerProfile(validCustomerId, updateProfileDto);
            // Assert
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Profile updated successfully");
        }

        // --------------------------------------------------------------------
        // UPDATE NEW PASSWORD TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task UpdateCustomerPassword_InvalidId_ReturnsFalse()
        {
            //Arrange
            var invalidCustomerId = "Invalid";
            _customerRepositoryMock
                .Setup(repo => repo.GetCustomerByIdAsync(It.IsAny<string>()))
                .ReturnsAsync((ApplicationUser?)null!);
            // Act
            var result = await _customerService.UpdateNewPasswordAsync(invalidCustomerId, new ChangePasswordDto());
            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Customer not found");
        }

        [Fact]
        public async Task UpdateCustomerPassword_UpdatePasswordFailed_ReturnsTrue()
        {
            //Arrange
            var validCustomerId = "Valid";
            var changePasswordDto = new ChangePasswordDto { OldPassword = "oldPass", NewPassword = "newPass" };
            var customerEntity = new ApplicationUser { Id = validCustomerId, Email = "old@example.com" };
            _customerRepositoryMock
                .Setup(repo => repo.GetCustomerByIdAsync(validCustomerId))
                .ReturnsAsync(customerEntity);
            _customerRepositoryMock
                .Setup(repo => repo.UpdateCustomerPasswordAsync(customerEntity, changePasswordDto.OldPassword, changePasswordDto.NewPassword))
                .ReturnsAsync(false);
            // Act
            var result = await _customerService.UpdateNewPasswordAsync(validCustomerId, changePasswordDto);
            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Failed to change password");
        }

        [Fact]
        public async Task UpdateCustomerPassword_ValidData_ReturnsTrue()
        {
            //Arrange
            var validCustomerId = "Valid";
            var changePasswordDto = new ChangePasswordDto { OldPassword = "oldPass", NewPassword = "newPass" };
            var customerEntity = new ApplicationUser { Id = validCustomerId, Email = "old@example.com" };
            _customerRepositoryMock
                .Setup(repo => repo.GetCustomerByIdAsync(validCustomerId))
                .ReturnsAsync(customerEntity);
            _customerRepositoryMock
                .Setup(repo => repo.UpdateCustomerPasswordAsync(customerEntity, changePasswordDto.OldPassword, changePasswordDto.NewPassword))
                .ReturnsAsync(true);
            // Act
            var result = await _customerService.UpdateNewPasswordAsync(validCustomerId, changePasswordDto);
            // Assert
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Change Password successfully");
        }

        // --------------------------------------------------------------------
        // ADD ADDRESS TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task AddAddressAsync_CustomerNotFound_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var addAddressDto = new AddAddressDto
            {
                FullName = "John Doe",
                PhoneNumber = "1234567890",
                Address = "123 Main St"
            };

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(false);

            // Act
            var result = await _customerService.AddAddressAsync(customerId, addAddressDto);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Customer not found");
            _customerRepositoryMock.Verify(repo => repo.AddAddressAsync(It.IsAny<CustomerAddress>()), Times.Never);
        }

        [Fact]
        public async Task AddAddressAsync_FailsToAdd_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var addAddressDto = new AddAddressDto
            {
                FullName = "John Doe",
                PhoneNumber = "1234567890",
                Address = "123 Main St"
            };

            var customerAddress = new CustomerAddress
            {
                CustomerId = customerId,
                FullName = addAddressDto.FullName,
                PhoneNumber = addAddressDto.PhoneNumber,
                Address = addAddressDto.Address
            };

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _mapperMock.Setup(m => m.Map<CustomerAddress>(addAddressDto))
                .Returns(customerAddress);
            _customerRepositoryMock.Setup(repo => repo.AddAddressAsync(It.IsAny<CustomerAddress>()))
                .ReturnsAsync((int?)null);

            // Act
            var result = await _customerService.AddAddressAsync(customerId, addAddressDto);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Failed to add new address");
        }

        [Fact]
        public async Task AddAddressAsync_Success_ReturnsAddressId()
        {
            // Arrange
            var customerId = "customer123";
            var addressId = 1;
            var addAddressDto = new AddAddressDto
            {
                FullName = "John Doe",
                PhoneNumber = "1234567890",
                Address = "123 Main St"
            };

            var customerAddress = new CustomerAddress
            {
                CustomerId = customerId,
                FullName = addAddressDto.FullName,
                PhoneNumber = addAddressDto.PhoneNumber,
                Address = addAddressDto.Address
            };

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _mapperMock.Setup(m => m.Map<CustomerAddress>(addAddressDto))
                .Returns(customerAddress);
            _customerRepositoryMock.Setup(repo => repo.AddAddressAsync(It.Is<CustomerAddress>(ca => ca.CustomerId == customerId)))
                .ReturnsAsync(addressId);

            // Act
            var result = await _customerService.AddAddressAsync(customerId, addAddressDto);

            // Assert
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Add new address successfully");
            result.AddressId.Should().Be(addressId);
        }

        // --------------------------------------------------------------------
        // EDIT ADDRESS TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task EditAddressAsync_CustomerNotFound_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var editAddressDto = new EditAddressDto
            {
                AddressId = 1,
                FullName = "John Doe Updated",
                PhoneNumber = "9876543210",
                Address = "456 Oak St"
            };

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(false);

            // Act
            var result = await _customerService.EditAddressAsync(customerId, editAddressDto);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Customer not found");
            _customerRepositoryMock.Verify(repo => repo.EditAddressAsync(It.IsAny<CustomerAddress>()), Times.Never);
        }

        [Fact]
        public async Task EditAddressAsync_FailsToEdit_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var editAddressDto = new EditAddressDto
            {
                AddressId = 1,
                FullName = "John Doe Updated",
                PhoneNumber = "9876543210",
                Address = "456 Oak St"
            };

            var customerAddress = new CustomerAddress
            {
                AddressId = editAddressDto.AddressId,
                CustomerId = customerId,
                FullName = editAddressDto.FullName,
                PhoneNumber = editAddressDto.PhoneNumber,
                Address = editAddressDto.Address
            };

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _mapperMock.Setup(m => m.Map<CustomerAddress>(editAddressDto))
                .Returns(customerAddress);
            _customerRepositoryMock.Setup(repo => repo.EditAddressAsync(It.IsAny<CustomerAddress>()))
                .ReturnsAsync(false);

            // Act
            var result = await _customerService.EditAddressAsync(customerId, editAddressDto);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Failed to edit address");
        }

        [Fact]
        public async Task EditAddressAsync_Success_ReturnsSuccess()
        {
            // Arrange
            var customerId = "customer123";
            var editAddressDto = new EditAddressDto
            {
                AddressId = 1,
                FullName = "John Doe Updated",
                PhoneNumber = "9876543210",
                Address = "456 Oak St"
            };

            var customerAddress = new CustomerAddress
            {
                AddressId = editAddressDto.AddressId,
                CustomerId = customerId,
                FullName = editAddressDto.FullName,
                PhoneNumber = editAddressDto.PhoneNumber,
                Address = editAddressDto.Address
            };

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _mapperMock.Setup(m => m.Map<CustomerAddress>(editAddressDto))
                .Returns(customerAddress);
            _customerRepositoryMock.Setup(repo => repo.EditAddressAsync(It.Is<CustomerAddress>(ca => ca.CustomerId == customerId)))
                .ReturnsAsync(true);

            // Act
            var result = await _customerService.EditAddressAsync(customerId, editAddressDto);

            // Assert
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Edit address successfully");
        }

        // --------------------------------------------------------------------
        // DELETE ADDRESS TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task DeleteAddressAsync_FailsToDelete_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var addressId = 1;

            _customerRepositoryMock.Setup(repo => repo.DeleteAddressAsync(customerId, addressId))
                .ReturnsAsync(false);

            // Act
            var result = await _customerService.DeleteAddressAsync(customerId, addressId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Failed to delete address");
        }

        [Fact]
        public async Task DeleteAddressAsync_Success_ReturnsSuccess()
        {
            // Arrange
            var customerId = "customer123";
            var addressId = 1;

            _customerRepositoryMock.Setup(repo => repo.DeleteAddressAsync(customerId, addressId))
                .ReturnsAsync(true);

            // Act
            var result = await _customerService.DeleteAddressAsync(customerId, addressId);

            // Assert
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Delete address successfully");
        }

        // --------------------------------------------------------------------
        // SEND CONTACT TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task SendContactAsync_FailsToSend_ReturnsFailure()
        {
            // Arrange
            var contactDto = new ContactDto
            {
                Name = "John Doe",
                Email = "john@example.com",
                Detail = "Test message"
            };

            var feedback = new Feedback
            {
                Name = contactDto.Name,
                Email = contactDto.Email,
                Detail = contactDto.Detail
            };

            _mapperMock.Setup(m => m.Map<Feedback>(contactDto))
                .Returns(feedback);
            _customerRepositoryMock.Setup(repo => repo.SendContactAsync(It.IsAny<Feedback>()))
                .ReturnsAsync(false);

            // Act
            var result = await _customerService.SendContactAsync(contactDto);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Send Contact Fail");
        }

        [Fact]
        public async Task SendContactAsync_Success_SendsEmailAndReturnsSuccess()
        {
            // Arrange
            var contactDto = new ContactDto
            {
                Name = "John Doe",
                Email = "john@example.com",
                Detail = "Test message"
            };

            var feedback = new Feedback
            {
                Name = contactDto.Name,
                Email = contactDto.Email,
                Detail = contactDto.Detail
            };

            _mapperMock.Setup(m => m.Map<Feedback>(contactDto))
                .Returns(feedback);
            _customerRepositoryMock.Setup(repo => repo.SendContactAsync(It.IsAny<Feedback>()))
                .ReturnsAsync(true);
            _backgroundTaskQueueMock.Setup(q => q.QueueBackgroundWorkItem(It.IsAny<Func<CancellationToken, Task>>()));

            // Act
            var result = await _customerService.SendContactAsync(contactDto);

            // Assert
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Send Contact Successfully");
            _backgroundTaskQueueMock.Verify(q => q.QueueBackgroundWorkItem(It.IsAny<Func<CancellationToken, Task>>()), Times.Once);
        }

        [Fact]
        public async Task SendContactAsync_SuccessWithoutEmail_ReturnsSuccessWithoutEmailSent()
        {
            // Arrange
            var contactDto = new ContactDto
            {
                Name = "John Doe",
                Email = null,
                Detail = "Test message"
            };

            var feedback = new Feedback
            {
                Name = contactDto.Name,
                Email = contactDto.Email,
                Detail = contactDto.Detail
            };

            _mapperMock.Setup(m => m.Map<Feedback>(contactDto))
                .Returns(feedback);
            _customerRepositoryMock.Setup(repo => repo.SendContactAsync(It.IsAny<Feedback>()))
                .ReturnsAsync(true);

            // Act
            var result = await _customerService.SendContactAsync(contactDto);

            // Assert
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Send Contact Successfully");
            _backgroundTaskQueueMock.Verify(q => q.QueueBackgroundWorkItem(It.IsAny<Func<CancellationToken, Task>>()), Times.Never);
        }

        // --------------------------------------------------------------------
        // SWITCH DEFAULT ADDRESS TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task SwitchDefaultAsync_CustomerNotFound_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var addressId = 1;

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(false);

            // Act
            var result = await _customerService.SwitchDefaultAsync(customerId, addressId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Customer not found");
            _customerRepositoryMock.Verify(repo => repo.SetDefaultAddressAsync(It.IsAny<string>(), It.IsAny<int>()), Times.Never);
        }

        [Fact]
        public async Task SwitchDefaultAsync_FailsToSwitch_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var addressId = 1;

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _customerRepositoryMock.Setup(repo => repo.SetDefaultAddressAsync(customerId, addressId))
                .ReturnsAsync(false);

            // Act
            var result = await _customerService.SwitchDefaultAsync(customerId, addressId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Failed to change default address");
        }

        [Fact]
        public async Task SwitchDefaultAsync_Success_ReturnsSuccess()
        {
            // Arrange
            var customerId = "customer123";
            var addressId = 1;

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _customerRepositoryMock.Setup(repo => repo.SetDefaultAddressAsync(customerId, addressId))
                .ReturnsAsync(true);

            // Act
            var result = await _customerService.SwitchDefaultAsync(customerId, addressId);

            // Assert
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Edit address successfully");
            result.AddressId.Should().Be(addressId);
        }

        // --------------------------------------------------------------------
        // GET ORDER DETAIL TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task GetOrderDetailAsync_CustomerNotFound_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var orderId = "order123";

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(false);

            // Act
            var result = await _customerService.GetOrderDetailAsync(customerId, orderId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Customer not found");
            _orderRepositoryMock.Verify(repo => repo.GetOrderDetailAsync(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetOrderDetailAsync_OrderNotFound_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var orderId = "order123";

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _orderRepositoryMock.Setup(repo => repo.GetOrderDetailAsync(customerId, orderId))
                .ReturnsAsync((Order?)null);

            // Act
            var result = await _customerService.GetOrderDetailAsync(customerId, orderId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Order not found");
        }

        [Fact]
        public async Task GetOrderDetailAsync_Success_ReturnsOrderDetail()
        {
            // Arrange
            var customerId = "customer123";
            var orderId = "order123";

            var order = new Order
            {
                OrderId = orderId,
                CustomerId = customerId,
                OrderDate = DateTime.Now,
                Name = "John Doe",
                NameReceive = "Jane Doe",
                ShippingAddress = "123 Main St",
                Address = "456 Oak St",
                Note = "Test note",
                CostDiscount = 10,
                ShippingCost = 5,
                FinalCost = 100,
                Status = new OrderStatus { Description = "Processing" },
                Payment = new Payment
                {
                    Status = DTech.Domain.Enums.PaymentStatusEnums.Paid,
                    PaymentMethod = new PaymentMethod { Description = "Credit Card" }
                },
                OrderProducts =
                [
                    new() {
                        Id = 1,
                        Product = new Product
                        {
                            Name = "Product 1",
                            Photo = "photo1.jpg",
                            Price = 50
                        },
                        Quantity = 2,
                        CostAtPurchase = 45
                    }
                ]
            };

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _orderRepositoryMock.Setup(repo => repo.GetOrderDetailAsync(customerId, orderId))
                .ReturnsAsync(order);

            // Act
            var result = await _customerService.GetOrderDetailAsync(customerId, orderId);

            // Assert
            result.Success.Should().BeTrue();
            result.OrderId.Should().Be(orderId);
            result.Name.Should().Be("John Doe");
            result.StatusName.Should().Be("Processing");
            result.OrderProducts.Should().HaveCount(1);
            result.Payment.Should().NotBeNull();
            result.Payment!.Status.Should().Be(PaymentStatusEnums.Paid);
        }

        // --------------------------------------------------------------------
        // CANCEL ORDER TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task CancelOrderAsync_CustomerNotFound_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var orderId = "order123";

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(false);

            // Act
            var result = await _customerService.CancelOrderAsync(customerId, orderId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Customer not found");
            _orderRepositoryMock.Verify(repo => repo.UpdateStatusAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>()), Times.Never);
        }

        [Fact]
        public async Task CancelOrderAsync_FailsToCancel_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var orderId = "order123";

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _orderRepositoryMock.Setup(repo => repo.UpdateStatusAsync(orderId, customerId, 7))
                .ReturnsAsync((Order?)null);

            // Act
            var result = await _customerService.CancelOrderAsync(customerId, orderId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Fail to cancel order");
        }

        [Fact]
        public async Task CancelOrderAsync_Success_ReturnsOrderDetail()
        {
            // Arrange
            var customerId = "customer123";
            var orderId = "order123";

            var cancelledOrder = new Order
            {
                OrderId = orderId,
                CustomerId = customerId,
                OrderDate = DateTime.Now,
                Name = "John Doe",
                NameReceive = "Jane Doe",
                ShippingAddress = "123 Main St",
                Address = "456 Oak St",
                Note = "Test note",
                CostDiscount = 10,
                ShippingCost = 5,
                FinalCost = 100,
                Status = new OrderStatus { Description = "Cancelled" },
                Payment = new Payment
                {
                    Status = PaymentStatusEnums.Pending,
                    PaymentMethod = new PaymentMethod { Description = "Credit Card" }
                },
                OrderProducts =
                [
                    new() {
                        Id = 1,
                        ProductId = 101,
                        Product = new Product
                        {
                            ProductId = 101,
                            Name = "Product 1",
                            Photo = "photo1.jpg",
                            Price = 50
                        },
                        Quantity = 2,
                        CostAtPurchase = 45
                    }
                ]
            };

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            
            // Mock UnitOfWork transaction methods
            _unitOfWorkService.Setup(uow => uow.BeginTransactionAsync())
                .Returns(Task.CompletedTask);
            _unitOfWorkService.Setup(uow => uow.CommitTransactionAsync())
                .Returns(Task.CompletedTask);
            _unitOfWorkService.Setup(uow => uow.RollbackTransactionAsync())
                .Returns(Task.CompletedTask);
            
            _orderRepositoryMock.Setup(repo => repo.UpdateStatusAsync(orderId, customerId, 7))
                .ReturnsAsync(cancelledOrder);
    
            _productRepositoryMock.Setup(repo => repo.IncreaseStockAsync(101, 2))
                .ReturnsAsync(true);

            // Act
            var result = await _customerService.CancelOrderAsync(customerId, orderId);

            // Assert
            result.Success.Should().BeTrue();
            result.OrderId.Should().Be(orderId);
            result.StatusName.Should().Be("Cancelled");
    
            // Verify the stock was restored
            _productRepositoryMock.Verify(repo => repo.IncreaseStockAsync(101, 2), Times.Once);
            _unitOfWorkService.Verify(uow => uow.BeginTransactionAsync(), Times.Once);
            _unitOfWorkService.Verify(uow => uow.CommitTransactionAsync(), Times.Once);
            _unitOfWorkService.Verify(uow => uow.RollbackTransactionAsync(), Times.Never);
        }

        [Fact]
        public async Task CancelOrderAsync_StockRestoreFails_RollsBackTransaction()
        {
            // Arrange
            var customerId = "customer123";
            var orderId = "order123";

            var cancelledOrder = new Order
            {
                OrderId = orderId,
                CustomerId = customerId,
                OrderDate = DateTime.Now,
                Name = "John Doe",
                NameReceive = "Jane Doe",
                ShippingAddress = "123 Main St",
                Address = "456 Oak St",
                Note = "Test note",
                CostDiscount = 10,
                ShippingCost = 5,
                FinalCost = 100,
                Status = new OrderStatus { Description = "Cancelled" },
                Payment = new Payment
                {
                    Status = PaymentStatusEnums.Pending,
                    PaymentMethod = new PaymentMethod { Description = "Credit Card" }
                },
                OrderProducts =
                [
                    new() {
                Id = 1,
                ProductId = 101,
                Product = new Product
                {
                    ProductId = 101,
                    Name = "Product 1",
                    Photo = "photo1.jpg",
                    Price = 50
                },
                Quantity = 2,
                CostAtPurchase = 45
            }
                ]
            };

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);

            _unitOfWorkService.Setup(uow => uow.BeginTransactionAsync())
                .Returns(Task.CompletedTask);
            _unitOfWorkService.Setup(uow => uow.CommitTransactionAsync())
                .Returns(Task.CompletedTask);
            _unitOfWorkService.Setup(uow => uow.RollbackTransactionAsync())
                .Returns(Task.CompletedTask);

            _orderRepositoryMock.Setup(repo => repo.UpdateStatusAsync(orderId, customerId, 7))
                .ReturnsAsync(cancelledOrder);

            // Mock IncreaseStockAsync to return false (failure)
            _productRepositoryMock.Setup(repo => repo.IncreaseStockAsync(101, 2))
                .ReturnsAsync(false);

            // Act
            var result = await _customerService.CancelOrderAsync(customerId, orderId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Failed to restore stock for Product 101");

            // Verify rollback was called
            _unitOfWorkService.Verify(uow => uow.RollbackTransactionAsync(), Times.Once);
            _unitOfWorkService.Verify(uow => uow.CommitTransactionAsync(), Times.Never);
        }

        // --------------------------------------------------------------------
        // ADD PRODUCT TO WISHLIST TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task AddProductToWishlistAsync_CustomerNotFound_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var productId = 1;

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(false);

            // Act
            var result = await _customerService.AddProductToWishlistAsync(customerId, productId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Customer not found");
            _customerRepositoryMock.Verify(repo => repo.AddProductToWishlistAsync(It.IsAny<string>(), It.IsAny<int>()), Times.Never);
        }

        [Fact]
        public async Task AddProductToWishlistAsync_FailsToAdd_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var productId = 1;

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _customerRepositoryMock.Setup(repo => repo.AddProductToWishlistAsync(customerId, productId))
                .ReturnsAsync(false);

            // Act
            var result = await _customerService.AddProductToWishlistAsync(customerId, productId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Failed to add product to wishlist");
        }

        [Fact]
        public async Task AddProductToWishlistAsync_Success_ReturnsSuccess()
        {
            // Arrange
            var customerId = "customer123";
            var productId = 1;

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _customerRepositoryMock.Setup(repo => repo.AddProductToWishlistAsync(customerId, productId))
                .ReturnsAsync(true);

            // Act
            var result = await _customerService.AddProductToWishlistAsync(customerId, productId);

            // Assert
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Add product to wishlist successfully");
        }

        // --------------------------------------------------------------------
        // GET WISHLIST TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task GetWishlistAsync_CustomerNotFound_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(false);

            // Act
            var result = await _customerService.GetWishlistAsync(customerId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Customer not found");
            _customerRepositoryMock.Verify(repo => repo.GetAllWishlistByCustomerIdAync(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetWishlistAsync_Success_ReturnsWishlist()
        {
            // Arrange
            var customerId = "customer123";

            var wishlists = new List<WishList>
            {
                new WishList { WishListId = 1, CustomerId = customerId, ProductId = 1 },
                new WishList { WishListId = 2, CustomerId = customerId, ProductId = 2 }
            };

            var product1 = new Product
            {
                ProductId = 1,
                Name = "Product 1",
                Price = 100
            };

            var product2 = new Product
            {
                ProductId = 2,
                Name = "Product 2",
                Price = 200
            };

            var productDto1 = new ProductDto { ProductId = 1, Name = "Product 1", Price = 100 };
            var productDto2 = new ProductDto { ProductId = 2, Name = "Product 2", Price = 200 };

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _customerRepositoryMock.Setup(repo => repo.GetAllWishlistByCustomerIdAync(customerId))
                .ReturnsAsync(wishlists);
            _productRepositoryMock.Setup(repo => repo.GetProductByIdAsync(1))
                .ReturnsAsync(product1);
            _productRepositoryMock.Setup(repo => repo.GetProductByIdAsync(2))
                .ReturnsAsync(product2);
            _mapperMock.Setup(m => m.Map<ProductDto>(product1))
                .Returns(productDto1);
            _mapperMock.Setup(m => m.Map<ProductDto>(product2))
                .Returns(productDto2);

            // Act
            var result = await _customerService.GetWishlistAsync(customerId);

            // Assert
            result.Success.Should().BeTrue();
            result.Data.Should().HaveCount(2);
            result.Data[0].ProductId.Should().Be(1);
            result.Data[1].ProductId.Should().Be(2);
        }

        // --------------------------------------------------------------------
        // REMOVE PRODUCT FROM WISHLIST TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task RemoveProductFromWishlistAsync_CustomerNotFound_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var productId = 1;

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(false);

            // Act
            var result = await _customerService.RemoveProductFromWishlistAsync(customerId, productId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Customer not found");
            _customerRepositoryMock.Verify(repo => repo.CheckWishlistAsync(It.IsAny<string>(), It.IsAny<int>()), Times.Never);
        }

        [Fact]
        public async Task RemoveProductFromWishlistAsync_ProductNotInWishlist_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var productId = 1;

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _customerRepositoryMock.Setup(repo => repo.CheckWishlistAsync(customerId, productId))
                .ReturnsAsync(false);

            // Act
            var result = await _customerService.RemoveProductFromWishlistAsync(customerId, productId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Failed to remove product from wishlist");
            _customerRepositoryMock.Verify(repo => repo.RemoveProductFromWishlistAsync(It.IsAny<string>(), It.IsAny<int>()), Times.Never);
        }

        [Fact]
        public async Task RemoveProductFromWishlistAsync_FailsToRemove_ReturnsFailure()
        {
            // Arrange
            var customerId = "customer123";
            var productId = 1;

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _customerRepositoryMock.Setup(repo => repo.CheckWishlistAsync(customerId, productId))
                .ReturnsAsync(true);
            _customerRepositoryMock.Setup(repo => repo.RemoveProductFromWishlistAsync(customerId, productId))
                .ReturnsAsync(false);

            // Act
            var result = await _customerService.RemoveProductFromWishlistAsync(customerId, productId);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Failed to remove product from wishlist");
        }

        [Fact]
        public async Task RemoveProductFromWishlistAsync_Success_ReturnsSuccess()
        {
            // Arrange
            var customerId = "customer123";
            var productId = 1;

            _customerRepositoryMock.Setup(repo => repo.CheckCustomerAsync(customerId))
                .ReturnsAsync(true);
            _customerRepositoryMock.Setup(repo => repo.CheckWishlistAsync(customerId, productId))
                .ReturnsAsync(true);
            _customerRepositoryMock.Setup(repo => repo.RemoveProductFromWishlistAsync(customerId, productId))
                .ReturnsAsync(true);

            // Act
            var result = await _customerService.RemoveProductFromWishlistAsync(customerId, productId);

            // Assert
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Remove product from wishlist successfully");
        }
    }
}
