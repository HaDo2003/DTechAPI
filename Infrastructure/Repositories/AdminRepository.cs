using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;

namespace DTech.Infrastructure.Repositories
{
    public class AdminRepository(
        DTechDbContext context,
        UserManager<ApplicationUser> userManager
    ) : IAdminRepository
    {
        public async Task<ApplicationUser?> GetAdminByIdAsync(string userId)
        {
            if (userId == null)
                return null;

            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
                return null;

            return user;
        }
    }
}
