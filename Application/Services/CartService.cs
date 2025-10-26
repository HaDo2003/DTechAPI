using AutoMapper;
using DTech.Application.DTOs.response;
using DTech.Application.DTOs.Response;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;

namespace DTech.Application.Services
{
    public class CartService(
        ICustomerRepository customerRepo,
        ICartRepository cartRepo,
        IProductRepository productRepo,
        IMapper mapper
    ) : ICartService
    {
        public async Task<MessageResponse> AddToCartAsync(string customerId, DTOs.request.CartProductDto model)
        {
            var customer = await customerRepo.CheckCustomerAsync(customerId);
            if (!customer)
                return new MessageResponse { Success = false, Message = "Customer not found" };

            var product = await productRepo.CheckProductByIdAsync(model.ProductId);
            if(!product)
                return new MessageResponse { Success = false, Message = "Product not found" };

            var cartId = await cartRepo.GetCartByUserIdAsync(customerId);
            if(cartId == 0)
                return new MessageResponse { Success = false, Message = "Cart not found" };

            var cartProduct = mapper.Map<CartProduct>(model);
            cartProduct.CartId = cartId;

            var isAdded = await cartRepo.AddToCartAsync(cartProduct);
            if (!isAdded)
                return new MessageResponse { Success = false, Message = "Failed to add to cart" };

            return new MessageResponse { Success = true, Message = "Added to Cart" };
        }

        public async Task<CartDto> GetCartAsync(string customerId)
        {
            var customer = await customerRepo.CheckCustomerAsync(customerId);
            if (!customer)
                return new CartDto { Success = false, Message = "Customer not found" };

            var cart = await cartRepo.GetFullCartByUserIdAsync(customerId);
            if (cart == null)
                return new CartDto { Success = false, Message = "Cart not found" };

            var cartDto = new CartDto
            {
                CartId = cart.CartId,
                CustomerId = cart.CustomerId,
                CartProducts = [.. cart.CartProducts.Select(cp => new CartProductDto
                {
                    Id = cp.Id,
                    ProductId = cp.ProductId,
                    Quantity = cp.Quantity,
                    Color = cp.ProductColor != null
                        ? new ProductColorDto
                        {
                            ColorId = cp.ProductColor.ColorId,
                            ColorName = cp.ProductColor.ColorName,
                            ColorCode = cp.ProductColor.ColorCode
                        }
                        : null,
                    Name = cp.Product?.Name,
                    Price = cp.Product?.Price,
                    Discount = cp.Product?.Discount,
                    PriceAfterDiscount = cp.Product?.PriceAfterDiscount,
                    Photo = cp.Product?.Photo
                })],
                Success = true,
                Message = "Cart retrieved successfully"
            };
            Console.WriteLine("[DEBUG] Cart product colors:");
            foreach (var p in cartDto.CartProducts)
            {
                Console.WriteLine(
                    $" - ProductId: {p.ProductId}, Name: {p.Name}, " +
                    $"ColorId: {p.Color?.ColorId}, ColorName: {p.Color?.ColorName}, ColorCode: {p.Color?.ColorCode}"
                );
            }

            return cartDto;
        }
        public async Task<CartDto> UpdateQuantityAsync(string customerId, int cartProductId, int change)
        {
            var customer = await customerRepo.CheckCustomerAsync(customerId);
            if (!customer)
                return new CartDto { Success = false, Message = "Customer not found" };

            var cartProduct = await cartRepo.UpdateCartProductAsync(cartProductId, customerId, change);
            if (!cartProduct)
                return new CartDto { Success = false, Message = "Update quantity failed" };

            var cartDto = await GetCartAsync(customerId);
            return cartDto;
        }
    }
}
