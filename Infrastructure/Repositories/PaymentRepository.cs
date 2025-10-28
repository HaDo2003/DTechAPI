using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;

namespace DTech.Infrastructure.Repositories
{
    public class PaymentRepository(
        DTechDbContext context
    ) : IPaymentRepository
    {
        public async Task<Payment?> AddAsync(Payment payment)
        {
            try
            {
                context.ChangeTracker.Clear();
                context.Payments.Add(payment);
                await context.SaveChangesAsync();
                return payment;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding payment: {ex.Message}");
                Console.WriteLine($"Inner exception: {ex.InnerException?.Message}");
                return null;
            }
        }
    }
}
