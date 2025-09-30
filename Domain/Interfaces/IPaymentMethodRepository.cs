using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface IPaymentMethodRepository
    {
        Task<List<PaymentMethod>> GetListAsync();
        Task<List<PaymentMethod>?> GetAllPaymentMethodsAsync();
        Task<PaymentMethod?> GetPaymentMethodByIdAsync(int paymentMethodId);
        Task<bool> CheckIfPaymentMethodExistsAsync(PaymentMethod paymentMethod);
        Task<(bool Success, string Message)> CreatePaymentMethodAsync(PaymentMethod paymentMethod);
        Task<(bool Success, string Message)> UpdatePaymentMethodAsync(PaymentMethod paymentMethod);
        Task<(bool Success, string Message)> DeletePaymentMethodAsync(int paymentMethodId);
    }
}
