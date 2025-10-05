using AutoMapper;
using DTech.Application.DTOs.response;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;

namespace DTech.Application.Services
{
    public class HomeService(
        IAdvertisementRepository advertisementRepo,
        IProductRepository productRepo,
        ICategoryRepository categoryRepo
    ) : IHomeService
    {
        public async Task<object> GetHomePageDataAsync()
        {
            var advertisements = await advertisementRepo.GetOrderedListAsync();
            var hotProducts = await productRepo.GetDiscountedProductsAsync();
            var accessories = await productRepo.GetAccessoriesAsync();

            var laptopProducts = await GetProductsByCategory("Laptop");
            var smartphoneProducts = await GetProductsByCategory("Smart Phone");
            var tabletProducts = await GetProductsByCategory("Tablet");

            var advertisementDtos = advertisements.Select(ad => new AdvertisementDto
            {
                AdvertisementId = ad.AdvertisementId,
                Name = ad.Name ?? "",
                Image = ad.Image ?? "",
                Order = ad.Order,
            }).ToList();
            var hotProductDtos = await MapProductsToDto(hotProducts);
            var accessoriesProductDtos = await MapProductsToDto(accessories);
            var laptopProductDtos = await MapProductsToDto(laptopProducts);
            var smartphoneProductDtos = await MapProductsToDto(smartphoneProducts);
            var tabletProductDtos = await MapProductsToDto(tabletProducts);

            return new
            {
                Advertisements = advertisementDtos,
                HotProducts = hotProductDtos,
                AccessoriesProducts = accessoriesProductDtos,
                LaptopProducts = laptopProductDtos,
                SmartphoneProducts = smartphoneProductDtos,
                TabletProducts = tabletProductDtos
            };
        }

        private async Task<List<Product>> GetProductsByCategory(string categoryName)
        {
            var categoryId = await categoryRepo.GetCategoryIdByNameAsync(categoryName);
            if (categoryId == null)
                return [];

            return await productRepo.GetProductsByCategoryIdAsync([categoryId.Value]);
        }

        private static Task<List<ProductDto>> MapProductsToDto(List<Product> products)
        {
            var productDtos = products.Select(p => new ProductDto
            {
                ProductId = p.ProductId,
                Name = p.Name ?? "",
                Slug = p.Slug ?? "",
                Warranty = p.Warranty,
                StatusProduct = p.StatusProduct,
                Price = p.Price,
                Discount = p.Discount,
                PriceAfterDiscount = p.PriceAfterDiscount,
                EndDateDiscount = p.EndDateDiscount,
                Views = p.Views,
                DateOfManufacture = p.DateOfManufacture,
                MadeIn = p.MadeIn,
                PromotionalGift = p.PromotionalGift,
                Photo = p.Photo,
                Description = p.Description,
                Category = p.Category != null ? new CategoryDto
                {
                    CategoryId = p.Category.CategoryId,
                    Name = p.Category.Name ?? "",
                    Slug = p.Category.Slug ?? "",
                } : null,
                Brand = p.Brand != null ? new BrandDto
                {
                    BrandId = p.Brand.BrandId,
                    Name = p.Brand.Name ?? "",
                    Slug = p.Brand.Slug ?? "",
                    Logo = p.Brand.Logo ?? "",
                } : null,
            }).ToList();

            return Task.FromResult(productDtos);
        }
    }
}
