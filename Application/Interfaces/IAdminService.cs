using DTech.Application.DTOs.response;

namespace DTech.Application.Interfaces
{
    public interface IAdminService
    {
        Task<AdminResDto> GetAdmin(string userId);
    }
}
