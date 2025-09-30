using DTech.Application.DTOs.response;
using DTech.Application.DTOs.response.admin;
using DTech.Application.DTOs.response.admin.admin;

namespace DTech.Application.Interfaces
{
    public interface IAdminService
    {
        Task<AdminResDto> GetAdmin(string userId);
        Task<IndexResDto<List<AdminIndexDto>>> GetAdmins();
        Task<IndexResDto<AdminDetailDto>> GetAdminDetailAsync(string userId);
        Task<IndexResDto<object?>> CreateAdminAsync(AdminDetailDto model, string? currentUserId);
        Task<IndexResDto<object?>> UpdateAdminAsync(string userId, AdminDetailDto model, string? currentUserId);
        Task<IndexResDto<object?>> DeleteAdminAsync(string userId);
        Task<List<RolesResDto>> GetRolesAsync();
    }
}
