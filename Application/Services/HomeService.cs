using AutoMapper;
using DTech.Application.DTOs;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;

namespace DTech.Application.Services
{
    public class HomeService(
        IAdvertisementRepository advertisementRepo,
        IProductRepository productRepo,
        ICategoryRepository categoryRepo,
        IMapper _mapper) : IHomeService
    {
        public async Task<object> GetHomePageDataAsync()
        {
            var advertisements = await advertisementRepo.GetOrderedListAsync();
            var hotProducts = await productRepo.GetDiscountedProductsAsync();
            var accessories = await productRepo.GetAccessoriesAsync();

            var laptopProducts = await GetProductsByCategory("Laptop");
            var smartphoneProducts = await GetProductsByCategory("Smart Phone");
            var tabletProducts = await GetProductsByCategory("Tablet");

            return new
            {
                Advertisements = _mapper.Map<List<AdvertisementDto>>(advertisements),
                HotProducts = _mapper.Map<List<ProductDto>>(hotProducts),
                LaptopProducts = _mapper.Map<List<ProductDto>>(laptopProducts),
                SmartphoneProducts = _mapper.Map<List<ProductDto>>(smartphoneProducts),
                TabletProducts = _mapper.Map<List<ProductDto>>(tabletProducts),
                AccessoriesProducts = _mapper.Map<List<ProductDto>>(accessories)
            };
        }

        private async Task<List<Product>> GetProductsByCategory(string categoryName)
        {
            var categoryId = await categoryRepo.GetCategoryIdByNameAsync(categoryName);
            if (categoryId == null)
                return [];

            return await productRepo.GetProductsByCategoryIdAsync(new List<int> { categoryId.Value });
        }
    }
}
