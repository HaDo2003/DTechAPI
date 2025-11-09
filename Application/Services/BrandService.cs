using DTech.Application.DTOs.Response.Admin;
using DTech.Application.DTOs.Response.Admin.Brand;
using DTech.Application.Helper;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;

namespace DTech.Application.Services
{
    public class BrandService(
        IAdminRepository adminRepo,
        IBrandRepository brandRepo,
        ICloudinaryService cloudinaryService
    ) : IBrandService
    {
        readonly string folderName = "Pre-thesis/Brand";

        public async Task<IndexResDto<List<BrandIndexDto>>> GetBrands()
        {
            var brands = await brandRepo.GetAllBrandsAsync();
            if (brands == null || brands.Count == 0)
            {
                return new IndexResDto<List<BrandIndexDto>>
                {
                    Success = false,
                    Message = "No brand found"
                };
            }

            var brandDtos = brands.Select(brand => new BrandIndexDto
            {
                Id = brand.BrandId,
                Name = brand.Name,
                Slug = brand.Slug,
            }).ToList();

            return new IndexResDto<List<BrandIndexDto>>
            {
                Success = true,
                Data = brandDtos
            };
        }

        public async Task<IndexResDto<BrandDetailDto>> GetBrandDetailAsync(int brandId)
        {
            var brand = await brandRepo.GetBrandByIdAsync(brandId);
            if (brand == null)
            {
                return new IndexResDto<BrandDetailDto>
                {
                    Success = false,
                    Message = "Brand not found"
                };
            }

            var brandDetail = new BrandDetailDto
            {
                Name = brand.Name,
                Slug = brand.Slug,
                Status = brand.Status,
                Image = brand.Logo,
                CreateDate = brand.CreateDate,
                CreatedBy = brand.CreatedBy,
                UpdateDate = brand.UpdateDate,
                UpdatedBy = brand.UpdatedBy
            };

            return new IndexResDto<BrandDetailDto>
            {
                Success = true,
                Data = brandDetail
            };
        }

        public async Task<IndexResDto<object?>> CreateBrandAsync(BrandDetailDto model, string? currentUserId)
        {
            try
            {
                Brand brand = new()
                {
                    Name = model.Name,
                    Status = model.Status,
                    CreateDate = DateTime.UtcNow,
                    CreatedBy = await adminRepo.GetAdminFullNameAsync(currentUserId),
                };

                brand.Slug = CreateSlug.GenerateSlug(brand.Name ?? string.Empty);

                var existingBrand = await brandRepo.CheckIfBrandExistsAsync(brand);
                if (existingBrand)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = "Brand with same name exists",
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

                    brand.Logo = imageName;
                }

                var (Success, Message) = await brandRepo.CreateBrandAsync(brand);

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
                    Message = "Brand created successfully",
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

        public async Task<IndexResDto<object?>> UpdateBrandAsync(int brandId, BrandDetailDto model, string? currentUserId)
        {
            try
            {
                Brand brand = new()
                {
                    BrandId = brandId,
                    Name = model.Name,
                    Logo = model.Image,
                    Status = model.Status,
                    UpdateDate = DateTime.UtcNow,
                    UpdatedBy = await adminRepo.GetAdminFullNameAsync(currentUserId),
                };

                string newSlug = CreateSlug.GenerateSlug(model.Name ?? string.Empty);
                brand.Slug = newSlug;

                var existingBrand = await brandRepo.CheckIfBrandExistsAsync(brand);
                if (existingBrand)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = "Brand with the same name already exists",
                        Data = null
                    };
                }

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

                    brand.Logo = imageName;
                }

                

                var (Success, Message) = await brandRepo.UpdateBrandAsync(brand);
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
                    Message = "Brand updated successfully",
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

        public async Task<IndexResDto<object?>> DeleteBrandAsync(int brandId)
        {
            try
            {
                var (Success, Message) = await brandRepo.DeleteBrandAsync(brandId);
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
                    Message = "Brand deleted successfully",
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
