using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DTech.Infrastructure.Repositories
{
    public class CartRepository(DTechDbContext context) : ICartRepository
    {
        public async Task<int> GetCartByUserIdAsync(string customerId)
        {
            var cart = await context.Carts.AsNoTracking().FirstOrDefaultAsync(c => c.CustomerId == customerId);
            if (cart == null)
            {
                return 0;
            }
            return cart.CartId;
        }

        public async Task<bool> AddToCartAsync(CartProduct product)
        {
            if (product != null)
            {
                context.CartProducts.Add(product);
                await context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<Cart?> GetFullCartByUserIdAsync(string customerId)
        {
            var cart = await context.Carts.AsNoTracking()
                .FirstOrDefaultAsync(c => c.CustomerId == customerId);
            if (cart == null)
            {
                return null;
            } 
            else
            {
                cart.CartProducts = await context.CartProducts
                    .AsNoTracking()
                    .Include(cp => cp.Product)
                    .Include(cp => cp.ProductColor)
                    .Where(cp => cp.CartId == cart.CartId)
                    .ToListAsync();
            }
            return cart;
        }

        public async Task<CartProduct?> CheckProductInCartAsync(int cartId, int ProductId, int ProductColorId)
        {
            var cp = await context.CartProducts
                .FirstOrDefaultAsync(cp => cp.CartId == cartId && cp.ProductId == ProductId && cp.ColorId == ProductColorId);
            if (cp == null)
            {
                return null;
            }
            return cp;
        }

        public async Task<bool> UpdateCartProductAsync(int cartProductId, string customerId, int change)
        {
            var cartProduct = await context.CartProducts
                .FirstOrDefaultAsync(cp => cp.Id == cartProductId && cp.Cart!.CustomerId == customerId);

            if (cartProduct == null)
                return false;

            if(change == 0)
            {
                context.CartProducts.Remove(cartProduct);
            }
            else
            {
                cartProduct.Quantity += change;
                if (cartProduct.Quantity < 1)
                    context.CartProducts.Remove(cartProduct);
            }

            await context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> ClearCartAsync(Cart cart)
        {
            try
            {
                if (cart != null)
                {
                    var cartProductsToRemove = await context.CartProducts
                        .Where(cp => cp.CartId == cart.CartId)
                        .ToListAsync();

                    context.CartProducts.RemoveRange(cartProductsToRemove);
                    await context.SaveChangesAsync();
                    return true;
                }
            } catch (Exception ex)
            {
                Console.WriteLine($"Error in Clear Cart: {ex.Message}");
                return false;
            }

            return false;
        }
    }
}
