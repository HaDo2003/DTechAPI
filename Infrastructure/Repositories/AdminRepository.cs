using DTech.Application.DTOs.response;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DTech.Infrastructure.Repositories
{
    public class AdminRepository(
        DTechDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager
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

        public async Task<List<ApplicationUser>?> GetAllAdminsAsync()
        {
            var admins = await userManager.GetUsersInRoleAsync("Admin");
            var sellers = await userManager.GetUsersInRoleAsync("Seller");

            var result = admins.Concat(sellers).ToList();

            if (result == null || result.Count == 0)
                return null;
            return [.. result];
        }

        public async Task<(string RoleId, string RoleName)> GetUserRoleAsync(ApplicationUser user)
        {
            var roles = await userManager.GetRolesAsync(user);
            var roleName = roles.FirstOrDefault();

            if (string.IsNullOrEmpty(roleName))
                return (string.Empty, "No Role");

            var role = await roleManager.FindByNameAsync(roleName);

            return role != null && role.Name != null
                ? (role.Id, role.Name)
                : (string.Empty, "No Role");
        }

        public Task<IdentityRole?> FindRoleByIdAsync(string? roleId)
        {
            if (roleId == null)
                return Task.FromResult<IdentityRole?>(null);

            return roleManager.FindByIdAsync(roleId)!;
        }

        public async Task<bool> CheckIfAdminExistsAsync(ApplicationUser user)
        {
            if (user == null)
                return false;
            if (user.UserName == null && user.Email == null && user.PhoneNumber == null)
                return false;
            if (user.Id != null)
            {
                return await context.Users.AnyAsync(u =>
                    u.Id != user.Id && (
                        u.UserName == user.UserName ||
                        u.Email == user.Email ||
                        u.PhoneNumber == user.PhoneNumber
                    )
                );
            }
            else
            {
                var isExist = await context.Users.AnyAsync(u =>
                    u.UserName == user.UserName ||
                    u.Email == user.Email ||
                    u.PhoneNumber == user.PhoneNumber
                );

                return isExist;
            }
        }

        public async Task<(bool Success, string Message)> CreateAdminAsync(ApplicationUser user, string? roleId)
        {
            var result = await userManager.CreateAsync(user, "123456");
            if (!result.Succeeded)
            {
                return
                (
                    false,
                    string.Join(", ", result.Errors.Select(e => e.Description))
                );
            }

            if (!string.IsNullOrEmpty(roleId))
            {
                var role = await FindRoleByIdAsync(roleId);
                if (role == null)
                {
                    var roleResult = await roleManager.CreateAsync(new IdentityRole(roleId));
                    if (!roleResult.Succeeded)
                    {
                        return
                        (
                            false,
                            string.Join(", ", roleResult.Errors.Select(e => e.Description))
                        );
                    }
                }

                var addToRoleResult = await userManager.AddToRoleAsync(user, role!.Name!);
                if (!addToRoleResult.Succeeded)
                {
                    return
                    (
                        false,
                        string.Join(", ", addToRoleResult.Errors.Select(e => e.Description))
                    );
                }
            }

            Cart cart = new()
            {
                CustomerId = user.Id
            };
            if (cart != null)
            {
                context.Carts.Add(cart);
                await context.SaveChangesAsync();
            }

            return
            (
                true,
                "Admin created successfully"
            );
        }

        public async Task<(bool Success, string Message)> UpdateAdminAsync(ApplicationUser user, string? roleId)
        {
            var existingUser = await userManager.FindByIdAsync(user.Id);
            if (existingUser == null)
                return (false, "User not found");

            // Update user fields
            existingUser.FullName = user.FullName;
            existingUser.UserName = user.UserName;
            existingUser.Email = user.Email;
            existingUser.PhoneNumber = user.PhoneNumber;
            existingUser.Gender = user.Gender;
            existingUser.DateOfBirth = user.DateOfBirth;
            existingUser.Image = user.Image;
            existingUser.UpdateDate = DateTime.UtcNow;
            existingUser.UpdatedBy = user.UpdatedBy;
            existingUser.RoleId = user.RoleId;

            // Update user
            var updateResult = await userManager.UpdateAsync(existingUser);
            if (!updateResult.Succeeded)
            {
                var errors = string.Join("; ", updateResult.Errors.Select(e => e.Description));
                return (false, $"Failed to update user: {errors}");
            }

            // Handle role change
            if (!string.IsNullOrEmpty(roleId) && roleId != existingUser.RoleId)
            {
                var role = await FindRoleByIdAsync(roleId);
                if (role == null)
                    return (false, "Role not found");

                var currentRoles = await userManager.GetRolesAsync(existingUser);
                if (currentRoles.Any())
                {
                    var removeResult = await userManager.RemoveFromRolesAsync(existingUser, currentRoles);
                    if (!removeResult.Succeeded)
                    {
                        var errors = string.Join("; ", removeResult.Errors.Select(e => e.Description));
                        return (false, $"Failed to remove user from current roles: {errors}");
                    }
                }

                var addToRoleResult = await userManager.AddToRoleAsync(existingUser, role.Name!);
                if (!addToRoleResult.Succeeded)
                {
                    var errors = string.Join("; ", addToRoleResult.Errors.Select(e => e.Description));
                    return (false, $"Failed to add user to new role: {errors}");
                }

                existingUser.RoleId = role.Id;
            }

            return (true, "Admin updated successfully");
        }

        public async Task<(bool Success, string Message)> DeleteAdminAsync(string userId)
        {
            var existingUser = await userManager.FindByIdAsync(userId);
            if (existingUser == null)
                return (false, "User not found");

            var carts = context.Carts.Where(c => c.CustomerId == userId);
            if (carts.Any())
            {
                context.Carts.RemoveRange(carts);
                await context.SaveChangesAsync();
            }

            var result = await userManager.DeleteAsync(existingUser);
            return (result.Succeeded, string.Join(", ", result.Errors.Select(e => e.Description)));
        }

        public async Task<List<IdentityRole>> GetAllRolesAsync()
        {
            var roles = await roleManager.Roles.ToListAsync();
            return roles;
        }

        public async Task<string> GetAdminFullNameAsync(string? currentUserId)
        {
            if (currentUserId == null)
                return "Unknown User";
            var user = await userManager.FindByIdAsync(currentUserId);
            return user?.FullName ?? "Unknown User";
        }
    }
}
