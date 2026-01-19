using DTech.Application.Interfaces;
using DTech.Application.Services;
using DTech.Domain.Interfaces;
using Moq;
using Xunit;

namespace DTech.UnitTest.Services
{
    public class AdvertisementServiceTests
    {
        private readonly Mock<IAdminRepository> _adminRepoMock;
        private readonly Mock<IAdvertisementRepository> _advertisementRepoMock;
        private readonly Mock<ICloudinaryService> _cloudinaryServiceMock;
        private readonly AdvertisementService _advertisementService;

        public AdvertisementServiceTests()
        {
            _adminRepoMock = new Mock<IAdminRepository>();
            _advertisementRepoMock = new Mock<IAdvertisementRepository>();
            _cloudinaryServiceMock = new Mock<ICloudinaryService>();
            _advertisementService = new AdvertisementService(
                _adminRepoMock.Object,
                _advertisementRepoMock.Object,
                _cloudinaryServiceMock.Object
            );
        }

        [Fact]
        public async Task GetAdvertisementsAsync_NoAdvertisements_ReturnsFailureResponse()
        {
            // Arrange
            _advertisementRepoMock
                .Setup(repo => repo.GetAllAdvertisementsAsync())
                .ReturnsAsync([]);
            // Act
            var result = await _advertisementService.GetAdvertisementsAsync();
            // Assert
            Assert.False(result.Success);
            Assert.Equal("No advertisement found", result.Message);
            Assert.Null(result.Data);
        }
    }
}
