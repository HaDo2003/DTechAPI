using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface IAdvertisementRepository
    {
        Task<List<Advertisement>> GetOrderedListAsync();
    }
}
