using DTech.Application.DTOs.response.admin;
using DTech.Application.DTOs.response.admin.advertisement;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;

namespace DTech.Application.Services
{
    public class AdvertisementService(
        IAdminRepository adminRepo,
        IAdvertisementRepository advRepo,
        ICloudinaryService cloudinaryService
    ) : IAdvertisementService
    {
        readonly string folderName = "Pre-thesis/Advertisement";
        public async Task<IndexResDto<List<AdvertisementIndexDto>>> GetAdvertisementsAsync()
        {
            var advs = await advRepo.GetAllAdvertisementsAsync();
            if (advs == null || advs.Count == 0)
            {
                return new IndexResDto<List<AdvertisementIndexDto>>
                {
                    Success = false,
                    Message = "No advertisement found"
                };
            }

            var advDtos = advs.Select(adv => new AdvertisementIndexDto
            {
                Id = adv.AdvertisementId,
                Name = adv.Name,
                Order = adv.Order,
            }).ToList();

            return new IndexResDto<List<AdvertisementIndexDto>>
            {
                Success = true,
                Data = advDtos
            };
        }
        public async Task<IndexResDto<AdvertisementDetailDto>> GetAdvertisementDetailAsync(int advertisementId)
        {
            var adv = await advRepo.GetAdvertisementByIdAsync(advertisementId);
            if (adv == null)
            {
                return new IndexResDto<AdvertisementDetailDto>
                {
                    Success = false,
                    Message = "Advertisement not found"
                };
            }
            var advDetail = new AdvertisementDetailDto
            {
                Name = adv.Name,
                Slug = adv.Slug,
                Order = adv.Order,
                Status = adv.Status,
                Image = adv.Image,
                CreateDate = adv.CreateDate,
                CreatedBy = adv.CreatedBy,
                UpdateDate = adv.UpdateDate,
                UpdatedBy = adv.UpdatedBy
            };

            return new IndexResDto<AdvertisementDetailDto>
            {
                Success = true,
                Data = advDetail
            };
        }
        public async Task<IndexResDto<object?>> CreateAdvertisementAsync(AdvertisementDetailDto model, string? currentUserId)
        {
            try
            {
                Advertisement adv = new()
                {
                    Name = model.Name,
                    Order = model.Order,
                    Status = model.Status,
                    CreateDate = DateTime.UtcNow,
                    CreatedBy = await adminRepo.GetAdminFullNameAsync(currentUserId),
                };

                adv.Slug = adv.Name?.ToLower().Replace(" ", "-").Replace("/", "-");

                var existingAdv = await advRepo.CheckIfAdsExistsAsync(adv);
                if (existingAdv)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = "Advertisement with same name exists",
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

                    adv.Image = imageName;
                }

                var (Success, Message) = await advRepo.CreateAdvertisementAsync(adv);

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
                    Message = "Advertisement created successfully",
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
        public async Task<IndexResDto<object?>> UpdateAdvertisementAsync(int advertisementId, AdvertisementDetailDto model, string? currentUserId)
        {
            try
            {
                Advertisement adv = new()
                {
                    AdvertisementId = advertisementId,
                    Name = model.Name,
                    Order = model.Order,
                    Status = model.Status,
                    UpdateDate = DateTime.UtcNow,
                    UpdatedBy = await adminRepo.GetAdminFullNameAsync(currentUserId),
                    Image = model.Image,
                };

                string newSlug = model.Name?.ToLower().Replace(" ", "-").Replace("/", "-") ?? string.Empty;
                adv.Slug = newSlug;

                var existingAdv = await advRepo.CheckIfAdsExistsAsync(adv);
                if (existingAdv)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = "Advertisment with the same name already exists",
                        Data = null
                    };
                }

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

                    adv.Image = imageName;
                }
                
                var (Success, Message) = await advRepo.UpdateAdvertisementAsync(adv);
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
                    Message = "Advertisment updated successfully",
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
        public async Task<IndexResDto<object?>> DeleteAdvertisementAsync(int advertisementId)
        {
            try
            {
                var (Success, Message) = await advRepo.DeleteAdvertisementAsync(advertisementId);
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
                    Message = "Advertisment deleted successfully",
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
    }
}
