using DTech.Application.DTOs.response.admin;
using DTech.Application.DTOs.response.admin.advertisement;

namespace DTech.Application.Interfaces
{
    public interface IAdvertisementService
    {
        Task<IndexResDto<List<AdvertisementIndexDto>>> GetAdvertisementsAsync();
        Task<IndexResDto<AdvertisementDetailDto>> GetAdvertisementDetailAsync(int advertisementId);
        Task<IndexResDto<object?>> CreateAdvertisementAsync(AdvertisementDetailDto model, string? currentUserId);
        Task<IndexResDto<object?>> UpdateAdvertisementAsync(int advertisementId, AdvertisementDetailDto model, string? currentUserId);
        Task<IndexResDto<object?>> DeleteAdvertisementAsync(int advertisementId);
    }

}
