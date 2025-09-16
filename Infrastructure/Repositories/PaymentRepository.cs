using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

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
                context.Payments.Add(payment);
                await context.SaveChangesAsync();
                return payment;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding shipping: {ex.Message}");
                Console.WriteLine($"Inner exception: {ex.InnerException?.Message}");
                return null;
            }
        }

        public async Task<Payment?> GetByIdAsync(int? paymentId)
        {
            if (paymentId == null)
            {
                return null;
            }

            var payment = await context.Payments
                .AsNoTracking()
                .Include(p => p.PaymentMethod)
                .FirstOrDefaultAsync(a => a.PaymentId == paymentId);
            return payment;
        }

        public async Task<bool> UpdateAsync(Payment payment)
        {
            try
            {
                context.Payments.Update(payment);
                await context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }
    }
}
