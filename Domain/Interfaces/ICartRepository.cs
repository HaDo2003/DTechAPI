using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface ICartRepository
    {
        Task<int> GetCartByUserIdAsync(string customerId);
        Task<bool> AddToCartAsync(CartProduct product);
        Task<Cart?> GetFullCartByUserIdAsync(string customerId);

        Task<bool> UpdateCartProductAsync(int cartProductId, string customerId, int change);
        Task<bool> ClearCartAsync(Cart cart);
    }
}
