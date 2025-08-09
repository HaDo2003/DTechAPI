using DTech.Application.DTOs;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;

namespace DTech.Application.Services
{
    public class HomeService(
        IAdvertisementRepository advertisementRepo,
        IProductRepository productRepo,
        ICategoryRepository categoryRepo) : IHomeService
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
                Advertisements = advertisements.Select(a => new AdvertisementDto
                {
                    Id = a.AdvertisementId,
                    Name = a.Name ?? string.Empty,
                    ImageUrl = a.Image ?? string.Empty,
                    Order = a.Order
                }).ToList(),

                HotProducts = hotProducts.Select(p => new ProductDto
                {
                    Name = p.Name!,
                    Price = p.Price,
                    Discount = p.Discount
                }).ToList(),

                LaptopProducts = laptopProducts.Select(p => new ProductDto
                {
                    Name = p.Name!,
                    Price = p.Price,
                    Discount = p.Discount
                }).ToList(),

                SmartphoneProducts = smartphoneProducts.Select(p => new ProductDto
                {
                    Name = p.Name!,
                    Price = p.Price,
                    Discount = p.Discount
                }).ToList(),

                TabletProducts = tabletProducts.Select(p => new ProductDto
                {
                    Name = p.Name!,
                    Price = p.Price,
                    Discount = p.Discount
                }).ToList(),

                AccessoriesProducts = accessories.Select(p => new ProductDto
                {
                    Name = p.Name!,
                    Price = p.Price,
                    Discount = p.Discount
                }).ToList()
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
