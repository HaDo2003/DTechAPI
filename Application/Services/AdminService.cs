using DTech.Application.DTOs.response;
using DTech.Application.Interfaces;
using DTech.Domain.Interfaces;

namespace DTech.Application.Services
{
    public class AdminService(
        IAdminRepository adminRepo
    ) : IAdminService
    {
        public async Task<AdminResDto> GetAdmin(string userId)
        {
            var user = await adminRepo.GetAdminByIdAsync(userId);
            if (user == null)
                return new AdminResDto { Success = false, Message = "User not found" };

            return new AdminResDto
            {
                Success = true,
                Avatar = user.Image,
                UserName = user.FullName,
                CreateDate = user.CreateDate
            };
        }
    }
}
