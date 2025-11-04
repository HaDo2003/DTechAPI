using DTech.Application.Interfaces;
using DTech.Application.Services;
using DTech.Domain.Interfaces;
using Moq;
using Xunit;

namespace DTech.UnitTest.Services
{
    public class AdvertismentServiceTests
    {
        private readonly Mock<IAdminRepository> _adminRepoMock;
        private readonly Mock<IAdvertisementRepository> _advertismentRepoMock;
        private readonly Mock<ICloudinaryService> _cloudinaryServiceMock;
        private readonly AdvertisementService _advertismentService;

        public AdvertismentServiceTests()
        {
            _adminRepoMock = new Mock<IAdminRepository>();
            _advertismentRepoMock = new Mock<IAdvertisementRepository>();
            _cloudinaryServiceMock = new Mock<ICloudinaryService>();
            _advertismentService = new AdvertisementService(
                _adminRepoMock.Object,
                _advertismentRepoMock.Object,
                _cloudinaryServiceMock.Object
            );
        }

        [Fact]
        public async Task GetAdvertisementsAsync_NoAdvertisements_ReturnsFailureResponse()
        {
            // Arrange
            _advertismentRepoMock
                .Setup(repo => repo.GetAllAdvertisementsAsync())
                .ReturnsAsync([]);
            // Act
            var result = await _advertismentService.GetAdvertisementsAsync();
            // Assert
            Assert.False(result.Success);
            Assert.Equal("No advertisement found", result.Message);
            Assert.Null(result.Data);
        }
    }
}
