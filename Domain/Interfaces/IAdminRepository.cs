﻿using DTech.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace DTech.Domain.Interfaces
{
    public interface IAdminRepository
    {
        Task<ApplicationUser?> GetAdminByIdAsync(string userId);
        Task<List<ApplicationUser>?> GetAllAdminsAsync();
        Task<(string RoleId, string RoleName)> GetUserRoleAsync(ApplicationUser user);
        Task<bool> CheckIfAdminExistsAsync(ApplicationUser user);
        Task<IdentityRole?> FindRoleByIdAsync(string? roleId);
        Task<(bool Success, string Message)> CreateAdminAsync(ApplicationUser user, string? roleName);
        Task<bool> UpdateAdminAsync(ApplicationUser user, string? roleName);
        Task<(bool Success, string Message)> DeleteAdminAsync(string userId);
        Task<List<IdentityRole>> GetAllRolesAsync();
    }
}
