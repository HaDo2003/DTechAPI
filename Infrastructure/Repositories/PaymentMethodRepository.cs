using DTech.Domain.Entities;
using DTech.Domain.Enums;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DTech.Infrastructure.Repositories
{
    public class PaymentMethodRepository(
        DTechDbContext context
    ) : IPaymentMethodRepository
    {
        public async Task<List<PaymentMethod>> GetListAsync()
        {
            return await context.PaymentMethods.AsNoTracking().ToListAsync();
        }

        public async Task<List<PaymentMethod>?> GetAllPaymentMethodsAsync()
        {
            return await context.PaymentMethods
                .AsNoTracking()
                .OrderBy(p => p.PaymentMethodId)
                .ToListAsync();
        }

        public async Task<PaymentMethod?> GetPaymentMethodByIdAsync(int paymentMethodId)
        {
            if (paymentMethodId <= 0)
                return null;

            return await context.PaymentMethods.FindAsync(paymentMethodId);
        }

        public async Task<bool> CheckIfPaymentMethodExistsAsync(PaymentMethod paymentMethod)
        {
            if (paymentMethod == null || string.IsNullOrWhiteSpace(paymentMethod.Description))
                return false;

            if (paymentMethod.PaymentMethodId > 0)
            {
                return await context.PaymentMethods.AnyAsync(p =>
                    EF.Functions.ILike(p.Description!, paymentMethod.Description) &&
                    p.PaymentMethodId != paymentMethod.PaymentMethodId);
            }
            else
            {
                return await context.PaymentMethods.AnyAsync(p =>
                    EF.Functions.ILike(p.Description!, paymentMethod.Description));
            }
        }

        public async Task<(bool Success, string Message)> CreatePaymentMethodAsync(PaymentMethod paymentMethod)
        {
            if (paymentMethod == null)
                return (false, "Payment method is null");

            await context.PaymentMethods.AddAsync(paymentMethod);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Payment method created successfully");
            else
                return (false, "Failed to create payment method");
        }

        public async Task<(bool Success, string Message)> UpdatePaymentMethodAsync(PaymentMethod paymentMethod)
        {
            var existingMethod = await context.PaymentMethods.FindAsync(paymentMethod.PaymentMethodId);
            if (existingMethod == null)
                return (false, "Payment method not found");

            existingMethod.Description = paymentMethod.Description;
            existingMethod.UpdateDate = DateTime.UtcNow;
            existingMethod.UpdatedBy = paymentMethod.UpdatedBy;

            context.PaymentMethods.Update(existingMethod);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Payment method updated successfully");
            else
                return (false, "Failed to update payment method");
        }

        public async Task<(bool Success, string Message)> DeletePaymentMethodAsync(int paymentMethodId)
        {
            var paymentMethod = await context.PaymentMethods.FindAsync(paymentMethodId);
            if (paymentMethod == null)
                return (false, "Payment method not found");

            context.PaymentMethods.Remove(paymentMethod);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Payment method deleted successfully");
            else
                return (false, "Failed to delete payment method");
        }
    }
}
