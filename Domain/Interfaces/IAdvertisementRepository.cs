using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface IAdvertisementRepository
    {
        Task<List<Advertisement>> GetOrderedListAsync();
        Task<List<Advertisement>?> GetAllAdvertisementsAsync();
        Task<Advertisement?> GetAdvertisementByIdAsync(int advertisementId);
        Task<bool> CheckIfAdsExistsAsync(Advertisement advertisement);
        Task<(bool Success, string Message)> CreateAdvertisementAsync(Advertisement advertisement);
        Task<(bool Success, string Message)> UpdateAdvertisementAsync(Advertisement advertisement);
        Task<(bool Success, string Message)> DeleteAdvertisementAsync(int advertisementId);
    }
}
