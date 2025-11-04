using AutoMapper;
using DTech.Application.DTOs.request;
using DTech.Application.Interfaces;
using DTech.Application.Services;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Moq;
using Xunit;

namespace DTech.UnitTest.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<ICustomerRepository> _customerRepoMock;
        private readonly Mock<ITokenService> _tokenServiceMock;
        private readonly Mock<IEmailService> _emailServiceMock;
        private readonly Mock<IBackgroundTaskQueue> _backgroundTaskQueueMock;
        private readonly Mock<IMapper> _mapperMock;
        private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
        private readonly Mock<RoleManager<IdentityRole>> _roleManagerMock;
        private readonly Mock<IHttpClientFactory> _httpClientFactoryMock;

        private readonly AuthService _authService;

        public AuthServiceTests()
        {
            _customerRepoMock = new Mock<ICustomerRepository>();
            _tokenServiceMock = new Mock<ITokenService>();
            _emailServiceMock = new Mock<IEmailService>();
            _backgroundTaskQueueMock = new Mock<IBackgroundTaskQueue>();
            _mapperMock = new Mock<IMapper>();
            _httpClientFactoryMock = new Mock<IHttpClientFactory>();

            // UserManager mock setup
            var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
            _userManagerMock = new Mock<UserManager<ApplicationUser>>(
                userStoreMock.Object, null!, null!, null!, null!, null!, null!, null!, null!);

            // RoleManager mock setup
            var roleStoreMock = new Mock<IRoleStore<IdentityRole>>();
            _roleManagerMock = new Mock<RoleManager<IdentityRole>>(
                roleStoreMock.Object, null!, null!, null!, null!);

            _authService = new AuthService(
                _customerRepoMock.Object,
                _tokenServiceMock.Object,
                _emailServiceMock.Object,
                _backgroundTaskQueueMock.Object,
                _mapperMock.Object,
                _userManagerMock.Object,
                _roleManagerMock.Object,
                _httpClientFactoryMock.Object
            );
        }

        // --------------------------------------------------------------------
        // LOGIN TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task LoginAsync_InvalidAccount_ReturnsFailure()
        {
            // Arrange
            var model = new LoginDto { Account = "unknown", Password = "123" };
            _userManagerMock.Setup(u => u.FindByNameAsync(model.Account))
                .ReturnsAsync((ApplicationUser)null!);

            // Act
            var result = await _authService.LoginAsync(model);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Invalid account or password");
        }

        [Fact]
        public async Task LoginAsync_InvalidPassword_ReturnsFailure()
        {
            // Arrange
            var user = new ApplicationUser { UserName = "test" };
            var model = new LoginDto { Account = "test", Password = "wrong" };

            _userManagerMock.Setup(u => u.FindByNameAsync("test")).ReturnsAsync(user);
            _userManagerMock.Setup(u => u.CheckPasswordAsync(user, "wrong")).ReturnsAsync(false);

            // Act
            var result = await _authService.LoginAsync(model);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Invalid account or password");
        }

        [Fact]
        public async Task LoginAsync_ValidCredentials_ReturnsTokenAndSuccess()
        {
            // Arrange
            var user = new ApplicationUser { UserName = "test" };
            var model = new LoginDto { Account = "test", Password = "123" };

            _userManagerMock.Setup(u => u.FindByNameAsync("test")).ReturnsAsync(user);
            _userManagerMock.Setup(u => u.CheckPasswordAsync(user, "123")).ReturnsAsync(true);
            _tokenServiceMock.Setup(t => t.CreateToken(user)).Returns("token123");

            // Act
            var result = await _authService.LoginAsync(model);

            // Assert
            result.Success.Should().BeTrue();
            result.Token.Should().Be("token123");
            result.Message.Should().Be("Login successful");
        }

        // --------------------------------------------------------------------
        // REGISTER TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task RegisterAsync_PhoneAlreadyExists_ReturnsFailure()
        {
            // Arrange
            var model = new RegisterDto { Account = "testuser", PhoneNumber = "0123", Password = "P@ssword1" };
            _customerRepoMock.Setup(r => r.CheckPhoneAsync("0123")).ReturnsAsync(true);

            // Act
            var result = await _authService.RegisterAsync(model);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Phone number already exists");
        }

        [Fact]
        public async Task RegisterAsync_CreateUserFails_ReturnsErrorMessage()
        {
            // Arrange
            var model = new RegisterDto
            {
                Account = "testuser",
                PhoneNumber = "0123",
                Password = "P@ssword1"
            };

            _customerRepoMock.Setup(r => r.CheckPhoneAsync("0123")).ReturnsAsync(false);
            var user = new ApplicationUser();
            _mapperMock.Setup(m => m.Map<ApplicationUser>(model)).Returns(user);

            var identityErrors = new List<IdentityError> { new() { Description = "Weak password" } };
            _userManagerMock.Setup(u => u.CreateAsync(user, "P@ssword1"))
                .ReturnsAsync(IdentityResult.Failed(identityErrors.ToArray()));

            // Act
            var result = await _authService.RegisterAsync(model);

            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Contain("Weak password");
        }

        [Fact]
        public async Task RegisterAsync_ValidRegistration_ReturnsSuccessAndToken()
        {
            // Arrange
            var model = new RegisterDto
            {
                Account = "johndoe",
                FullName = "John Doe",
                PhoneNumber = "0123",
                Email = "john@example.com",
                Address = "123 Test Street",
                Password = "Strong123!"
            };

            _customerRepoMock.Setup(r => r.CheckPhoneAsync(model.PhoneNumber)).ReturnsAsync(false);

            var roleId = "dc11b0b4-44c2-457f-a890-fce0d077dbe0";
            var user = new ApplicationUser { Id = "user1", RoleId = roleId };
            _mapperMock.Setup(m => m.Map<ApplicationUser>(model)).Returns(user);

            _userManagerMock.Setup(u => u.CreateAsync(user, model.Password))
                .ReturnsAsync(IdentityResult.Success);

            var role = new IdentityRole { Id = roleId, Name = "Customer" };
            _roleManagerMock.Setup(r => r.FindByIdAsync(roleId)).ReturnsAsync(role);

            _userManagerMock.Setup(u => u.AddToRoleAsync(user, role.Name))
                .ReturnsAsync(IdentityResult.Success);

            _customerRepoMock.Setup(r => r.CreateCustomerAddressAsync(It.IsAny<CustomerAddress>()))
                .ReturnsAsync(true);

            _customerRepoMock.Setup(r => r.CreateCartAsync(It.IsAny<Cart>()))
                .ReturnsAsync(true);

            _tokenServiceMock.Setup(t => t.CreateToken(user)).Returns("abc-token");

            // Act
            var result = await _authService.RegisterAsync(model);

            // Assert
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Registration successful");
            result.Token.Should().Be("abc-token");

            _userManagerMock.Verify(u => u.AddToRoleAsync(user, "Customer"), Times.Once);
            _customerRepoMock.Verify(r => r.CreateCustomerAddressAsync(It.Is<CustomerAddress>(a =>
                a.CustomerId == user.Id &&
                a.FullName == model.FullName &&
                a.PhoneNumber == model.PhoneNumber &&
                a.Address == model.Address &&
                a.IsDefault == true
            )), Times.Once);
            _customerRepoMock.Verify(r => r.CreateCartAsync(It.Is<Cart>(c => c.CustomerId == user.Id)), Times.Once);
        }

        // --------------------------------------------------------------------
        // FORGOT PASSWORD TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task ForgotPasswordAsync_NullEmail_ReturnsErrorMessage()
        {
            // Arrange
            var model = new ForgotPasswordDto { Email = null };
            // Act
            var result = await _authService.ForgotPasswordAsync(model);
            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Email not found");
        }

        [Fact]
        public async Task ForgotPasswordAsync_EmailNotFound_ReturnsErrorMessage()
        {
            // Arrange
            var model = new ForgotPasswordDto
            {
                Email = "test@gmail.com"
            };

            _userManagerMock.Setup(u => u.FindByEmailAsync(model.Email!))
                .ReturnsAsync((ApplicationUser?)null);

            // Act
            var result = await _authService.ForgotPasswordAsync(model);
            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Email not found");
        }

        [Fact]
        public async Task ForgotPasswordAsync_ValidEmail_ReturnsSuccessMessage()
        {
            // Arrange
            var model = new ForgotPasswordDto
            {
                Email = "phongsimia1362003@gmail.com"
            };
            var user = new ApplicationUser
            {
                UserName = "testuser",
                Email = model.Email
            };
            _userManagerMock.Setup(u => u.FindByEmailAsync(model.Email!))
                .ReturnsAsync(user);
            _userManagerMock.Setup(u => u.GeneratePasswordResetTokenAsync(user))
                .ReturnsAsync("reset-token-123");

            // Act
            var result = await _authService.ForgotPasswordAsync(model);
            // Assert
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Password reset link has been sent to your email");
        }

        // --------------------------------------------------------------------
        // RESET PASSWORD TESTS
        // --------------------------------------------------------------------
        [Fact]
        public async Task ResetPasswordAsync_InvalidEmail_ReturnsErrorMessage()
        {
            // Arrange
            var model = new ResetPasswordDto
            {
                Token = "some-token",
                Email = "test@gmail.com",
                NewPassword = "NewP@ssword1"
            };
            _userManagerMock.Setup(u => u.FindByEmailAsync(model.Email))
                .ReturnsAsync((ApplicationUser?)null);
            // Act
            var result = await _authService.ResetPasswordAsync(model);
            // Assert
            result.Success.Should().BeFalse();
            result.Message.Should().Be("Invalid email");
        }

        [Fact]
        public async Task ResetPasswordAsync_ValidRequest_ReturnsSuccessMessage()
        {
            // Arrange
            var model = new ResetPasswordDto
            {
                Token = "some-token",
                Email = "phongsimia1362003@gmail.com",
                NewPassword = "NewP@ssword1"
            };
            var user = new ApplicationUser
            {
                UserName = "testuser",
                Email = model.Email
            };
            _userManagerMock.Setup(u => u.FindByEmailAsync(model.Email))
                .ReturnsAsync(user);
            _userManagerMock.Setup(u => u.ResetPasswordAsync(user, model.Token, model.NewPassword))
                .ReturnsAsync(IdentityResult.Success);
            // Act
            var result = await _authService.ResetPasswordAsync(model);
            // Assert
            result.Success.Should().BeTrue();
            result.Message.Should().Be("Password has been reset successfully");
        }
    }
}
