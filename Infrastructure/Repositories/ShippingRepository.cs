using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;

namespace DTech.Infrastructure.Repositories
{
    public class ShippingRepository(
        DTechDbContext context
    ) : IShippingRepository
    {
        public async Task<Shipping?> AddAsync(Shipping shipping)
        {
            try
            {
                context.ChangeTracker.Clear();
                context.Shippings.Add(shipping);
                await context.SaveChangesAsync();
                return shipping;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding shipping: {ex.Message}");
                Console.WriteLine($"Inner exception: {ex.InnerException?.Message}");
                return null;
            }
        }
    }
}
