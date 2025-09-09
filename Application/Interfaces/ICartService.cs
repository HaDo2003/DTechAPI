using DTech.Application.DTOs.request;
using DTech.Application.DTOs.response;
using CartProductDto = DTech.Application.DTOs.request.CartProductDto;

namespace DTech.Application.Interfaces
{
    public interface ICartService
    {
        Task<MessageResponse> AddToCartAsync(string customerId, CartProductDto model);
        Task<CartDto> GetCartAsync(string customerId);
        Task<CartDto> UpdateQuantityAsync(string customerId, int cartProductId, int change);
    }
}
