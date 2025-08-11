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

            var adsDto = advertisements.Select(a => new AdvertisementDto
            {
                Id = a.AdvertisementId,
                Name = a.Name ?? string.Empty,
                ImageUrl = a.Image ?? string.Empty,
                Order = a.Order
            }).ToList();

            return new
            {
                Advertisements = adsDto,
                HotProducts = ReturnDtoProducts(hotProducts),
                LaptopProducts = ReturnDtoProducts(laptopProducts),
                SmartphoneProducts = ReturnDtoProducts(smartphoneProducts),
                TabletProducts = ReturnDtoProducts(tabletProducts),
                AccessoriesProducts = ReturnDtoProducts(accessories)
            };
        }

        private async Task<List<Product>> GetProductsByCategory(string categoryName)
        {
            var categoryId = await categoryRepo.GetCategoryIdByNameAsync(categoryName);
            if (categoryId == null)
                return [];

            return await productRepo.GetProductsByCategoryIdAsync(new List<int> { categoryId.Value });
        }

        private static List<ProductDto> ReturnDtoProducts(List<Product> products)
        {
            return [.. products.Select(p => new ProductDto
            {
                ProductId = p.ProductId,
                Name = p.Name!,
                Photo = p.Photo ?? string.Empty,
                Slug = p.Slug ?? string.Empty,
                Price = p.Price,
                PriceAfterDiscount = p.PriceAfterDiscount ?? p.Price,
                Discount = p.Discount,
                PromotionalGift = p.PromotionalGift ?? string.Empty,
                Category = new CategoryDto { Slug = p.Category!.Slug },
                Brand = new BrandDto { Slug = p.Brand!.Slug }
            })];
        }
    }
}
