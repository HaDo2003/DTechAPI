using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface IAdminRepository
    {
        Task<ApplicationUser?> GetAdminByIdAsync(string userId);
    }
}
