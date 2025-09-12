using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface IShippingRepository
    {
        Task<Shipping?> AddAsync(Shipping shipping);
    }
}
