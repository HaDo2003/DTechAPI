using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface IPaymentMethodRepository
    {
        Task<List<PaymentMethod>> GetListAsync();
    }
}
