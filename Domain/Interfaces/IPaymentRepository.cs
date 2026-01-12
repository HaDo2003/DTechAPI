using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface IPaymentRepository
    {
        Task<Payment?> AddAsync(Payment payment);
        Task<bool> UpdateAsync(Payment payment);
    }
}
