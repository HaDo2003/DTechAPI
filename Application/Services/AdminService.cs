using DTech.Application.DTOs.response;
using DTech.Application.DTOs.response.admin;
using DTech.Application.DTOs.response.admin.admin;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace DTech.Application.Services
{
    public class AdminService(
        IAdminRepository adminRepo,
        ICloudinaryService cloudinaryService
    ) : IAdminService
    {
        readonly string folderName = "Pre-thesis/Admin";
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

        public async Task<IndexResDto<List<AdminIndexDto>>> GetAdmins()
        {
            var admins = await adminRepo.GetAllAdminsAsync();
            if (admins == null || admins.Count == 0)
            {
                return new IndexResDto<List<AdminIndexDto>>
                {
                    Success = false,
                    Message = "No admins found"
                };
            }

            var adminDtos = admins.Select(user => new AdminIndexDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Gender = user.Gender,
                Role = adminRepo.GetUserRoleAsync(user).Result.RoleName,
            }).ToList();

            return new IndexResDto<List<AdminIndexDto>>
            {
                Success = true,
                Data = adminDtos
            };
        }

        public async Task<IndexResDto<AdminDetailDto>> GetAdminDetailAsync(string userId)
        {
            var admin = await adminRepo.GetAdminByIdAsync(userId);
            if (admin == null)
            {
                return new IndexResDto<AdminDetailDto>
                {
                    Success = false,
                    Message = "Admin not found"
                };
            }
            var (roleId, roleName) = await adminRepo.GetUserRoleAsync(admin);
            var adminDetail = new AdminDetailDto
            {
                FullName = admin.FullName,
                UserName = admin.UserName,
                Email = admin.Email,
                PhoneNumber = admin.PhoneNumber,
                Gender = admin.Gender,
                Role = roleName,
                RoleId = roleId,
                Image = admin.Image,
                DateOfBirth = admin.DateOfBirth,
                CreateDate = admin.CreateDate,
                CreatedBy = admin.CreatedBy,
                UpdateDate = admin.UpdateDate,
                UpdatedBy = admin.UpdatedBy
            };

            return new IndexResDto<AdminDetailDto>
            {
                Success = true,
                Data = adminDetail
            };
        }

        public async Task<IndexResDto<object?>> CreateAdminAsync(AdminDetailDto model, string? currentUserId)
        {
            try
            {
                var role = await adminRepo.FindRoleByIdAsync(model.RoleId);
                if (role == null)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = "Role not exist",
                        Data = null
                    };
                }

                ApplicationUser admin = new()
                {
                    FullName = model.FullName,
                    UserName = model.UserName,
                    Email = model.Email,
                    PhoneNumber = model.PhoneNumber,
                    Gender = model.Gender,
                    DateOfBirth = model.DateOfBirth,
                    RoleId = role.Id,
                    CreateDate = DateTime.UtcNow,
                    CreatedBy = await adminRepo.GetAdminFullNameAsync(currentUserId),
                };

                var existingUser = await adminRepo.CheckIfAdminExistsAsync(admin);
                if (existingUser)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = "Admin with the same username, email, or phone number already exists",
                        Data = null
                    };
                }

                if (model.ImageUpload != null && model.ImageUpload.Length > 0)
                {
                    string imageName = await cloudinaryService.UploadImageAsync(
                        model.ImageUpload,
                        folderName
                    );

                    if (string.IsNullOrEmpty(imageName))
                    {
                        return new IndexResDto<object?>
                        {
                            Success = false,
                            Message = "Image upload failed",
                            Data = null
                        };
                    }

                    admin.Image = imageName;
                }

                var (Success, Message) = await adminRepo.CreateAdminAsync(admin, model.RoleId);

                if (!Success)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = Message,
                        Data = null
                    };
                }

                return new IndexResDto<object?>
                {
                    Success = true,
                    Message = "Admin created successfully",
                    Data = null
                };
            } 
            catch (Exception ex)
            {
                return new IndexResDto<object?>
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}",
                    Data = null
                };
            }
        }
        public async Task<IndexResDto<object?>> UpdateAdminAsync(string userId, AdminDetailDto model,string? currentUserId)
        {
            try
            {
                var role = await adminRepo.FindRoleByIdAsync(model.RoleId);
                if (role == null)
                {
                    return new IndexResDto<object?>
                    {
                        Success = true,
                        Message = "Role not exist",
                        Data = null
                    };
                }

                ApplicationUser admin = new()
                {
                    Id = userId,
                    FullName = model.FullName,
                    UserName = model.UserName,
                    Email = model.Email,
                    PhoneNumber = model.PhoneNumber,
                    Gender = model.Gender,
                    DateOfBirth = model.DateOfBirth,
                    RoleId = role.Id,
                    UpdateDate = DateTime.UtcNow,
                    UpdatedBy = await adminRepo.GetAdminFullNameAsync(currentUserId),
                    Image = model.Image,
                };

                // Handle image change
                if (model.ImageUpload != null && model.ImageUpload.Length > 0)
                {
                    string imageName = await cloudinaryService.ChangeImageAsync(
                        oldfile: model.Image ?? string.Empty,
                        newfile: model.ImageUpload,
                        filepath: folderName
                    );

                    if (string.IsNullOrEmpty(imageName))
                    {
                        return new IndexResDto<object?> 
                        { 
                            Success = false, 
                            Message = "Image upload failed",
                            Data = null
                        };
                    }

                    admin.Image = imageName;
                }

                var existingUser = await adminRepo.CheckIfAdminExistsAsync(admin);
                if (existingUser)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = "Admin with the same username, email, or phone number already exists",
                        Data = null
                    };
                }

                var (Success, Message) = await adminRepo.UpdateAdminAsync(admin, model.RoleId);
                if (!Success)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = Message,
                        Data = null
                    };
                }
                return new IndexResDto<object?>
                {
                    Success = true,
                    Message = "Admin updated successfully",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new IndexResDto<object?>
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}",
                    Data = null
                };
            }
        }
        public async Task<IndexResDto<object?>> DeleteAdminAsync(string userId)
        {
            try
            {
                var (Success, Message) = await adminRepo.DeleteAdminAsync(userId);
                if (!Success)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = Message,
                        Data = null
                    };
                }
                return new IndexResDto<object?>
                {
                    Success = true,
                    Message = "Admin deleted successfully",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new IndexResDto<object?>
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<List<RolesResDto>> GetRolesAsync()
        {
            var roles = await adminRepo.GetAllRolesAsync();
            if (roles == null || roles.Count == 0)
            {
                return [];
            }
            var roleDtos = roles.Select(role => new RolesResDto
            {
                Id = role.Id,
                Name = role.Name
            }).ToList();
            return roleDtos;
        }
    }
}
