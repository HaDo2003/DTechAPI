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

        public async Task<MessageResponse> CreateAdminAsync(AdminDetailDto model)
        {
            try
            {
                var role = await adminRepo.FindRoleByIdAsync(model.RoleId);
                if (role == null)
                {
                    return new MessageResponse
                    {
                        Success = false,
                        Message = "Role not exist"
                    }; ;
                }

                if (model.ImageUpload != null && model.ImageUpload.Length > 0)
                {
                    string imageName = await cloudinaryService.UploadImageAsync(
                        model.ImageUpload,
                        folderName
                    );

                    if (string.IsNullOrEmpty(imageName))
                    {
                        return new MessageResponse { Success = false, Message = "Image upload failed" };
                    }

                    model.Image = imageName;
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
                    CreatedBy = model.FullName,
                    Image = model.Image
                };

                var existingUser = await adminRepo.CheckIfAdminExistsAsync(admin);
                if (existingUser)
                {
                    return new MessageResponse
                    {
                        Success = false,
                        Message = "Admin with the same username, email, or phone number already exists"
                    };
                }

                var (Success, Message) = await adminRepo.CreateAdminAsync(admin, model.RoleId);

                if (!Success)
                {
                    return new MessageResponse
                    {
                        Success = false,
                        Message = Message
                    };
                }

                return new MessageResponse
                {
                    Success = true,
                    Message = "Admin created successfully"
                };
            } 
            catch (Exception ex)
            {
                return new MessageResponse
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                };
            }
        }
        public async Task<MessageResponse> UpdateAdminAsync(string userId, AdminDetailDto model)
        {
            try
            {
                var role = await adminRepo.FindRoleByIdAsync(model.RoleId);
                if (role == null)
                {
                    return new MessageResponse
                    {
                        Success = true,
                        Message = "Role not exist"
                    }; ;
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
                    CreateDate = DateTime.UtcNow,
                    CreatedBy = model.FullName,
                    UpdateDate = DateTime.UtcNow,
                    UpdatedBy = model.FullName,
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
                        return new MessageResponse { Success = false, Message = "Image upload failed" };
                    }

                    admin.Image = imageName;
                }

                var existingUser = await adminRepo.CheckIfAdminExistsAsync(admin);
                if (existingUser)
                {
                    return new MessageResponse
                    {
                        Success = false,
                        Message = "Admin with the same username, email, or phone number already exists"
                    };
                }

                var result = await adminRepo.UpdateAdminAsync(admin, model.RoleId);
                return new MessageResponse
                {
                    Success = true,
                    Message = "Admin updated successfully"
                };
            }
            catch (Exception ex)
            {
                return new MessageResponse
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                };
            }
        }
        public async Task<MessageResponse> DeleteAdminAsync(string userId)
        {
            try
            {
                var result = await adminRepo.DeleteAdminAsync(userId);
                if (!result.Success)
                {
                    return new MessageResponse
                    {
                        Success = false,
                        Message = result.Message
                    };
                }
                return new MessageResponse
                {
                    Success = true,
                    Message = "Admin deleted successfully"
                };
            }
            catch (Exception ex)
            {
                return new MessageResponse
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
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
