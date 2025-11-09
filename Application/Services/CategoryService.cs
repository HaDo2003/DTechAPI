using DTech.Application.DTOs.Response.Admin;
using DTech.Application.DTOs.Response.Admin.Category;
using DTech.Application.Helper;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using System.Data;

namespace DTech.Application.Services
{
    public class CategoryService(
        IAdminRepository adminRepo,
        ICategoryRepository categoryRepo
    ) : ICategoryService
    {
        public async Task<IndexResDto<List<CategoryIndexDto>>> GetCategoriesAsync()
        {
            var categories = await categoryRepo.GetAllCategoriesAsync();
            if (categories == null || categories.Count == 0)
            {
                return new IndexResDto<List<CategoryIndexDto>>
                {
                    Success = false,
                    Message = "No category found"
                };
            }

            var categoryDtos = categories.Select(cat => new CategoryIndexDto
            {
                Id = cat.CategoryId,
                Name = cat.Name,
                Slug = cat.Slug,
                ParentName = cat.Parent?.Name,
            }).ToList();

            return new IndexResDto<List<CategoryIndexDto>>
            {
                Success = true,
                Data = categoryDtos
            };
        }

        public async Task<IndexResDto<CategoryDetailDto>> GetCategoryDetailAsync(int categoryId)
        {
            var cat = await categoryRepo.GetCategoryByIdAsync(categoryId);
            if (cat == null)
            {
                return new IndexResDto<CategoryDetailDto>
                {
                    Success = false,
                    Message = "Category not found"
                };
            }

            var categoryDetail = new CategoryDetailDto
            {
                Name = cat.Name,
                Slug = cat.Slug,
                ParentId = cat.Parent != null ? cat.Parent.CategoryId : 0,
                ParentName = cat.Parent != null ? cat.Parent.Name : "N/A",
                Status = cat.Status,
                CreateDate = cat.CreateDate,
                CreatedBy = cat.CreatedBy,
                UpdateDate = cat.UpdateDate,
                UpdatedBy = cat.UpdatedBy
            };

            return new IndexResDto<CategoryDetailDto>
            {
                Success = true,
                Data = categoryDetail
            };
        }

        public async Task<IndexResDto<object?>> CreateCategoryAsync(CategoryDetailDto model, string? currentUserId)
        {
            try
            {

                Category cat = new()
                {
                    Name = model.Name,
                    Status = model.Status,
                    ParentId = model.ParentId,
                    CreateDate = DateTime.UtcNow,
                    CreatedBy = await adminRepo.GetAdminFullNameAsync(currentUserId),
                };

                cat.Slug = CreateSlug.GenerateSlug(cat.Name ?? string.Empty);

                var existingCat = await categoryRepo.CheckIfCategoryExistsAsync(cat);
                if (existingCat)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = "Category with same name exists",
                        Data = null
                    };
                }

                var (Success, Message) = await categoryRepo.CreateCategoryAsync(cat);

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
                    Message = "Category created successfully",
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

        public async Task<IndexResDto<object?>> UpdateCategoryAsync(int categoryId, CategoryDetailDto model, string? currentUserId)
        {
            try
            {
                Category cat = new()
                {
                    CategoryId = categoryId,
                    Name = model.Name,
                    ParentId = model.ParentId,
                    Status = model.Status,
                    UpdateDate = DateTime.UtcNow,
                    UpdatedBy = await adminRepo.GetAdminFullNameAsync(currentUserId),
                };
                cat.Slug = CreateSlug.GenerateSlug(model.Name ?? string.Empty);

                var existingCat = await categoryRepo.CheckIfCategoryExistsAsync(cat);
                if (existingCat)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = "Category with the same name already exists",
                        Data = null
                    };
                }

                var (Success, Message) = await categoryRepo.UpdateCategoryAsync(cat);
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
                    Message = "Category updated successfully",
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

        public async Task<IndexResDto<object?>> DeleteCategoryAsync(int categoryId)
        {
            try
            {
                var (Success, Message) = await categoryRepo.DeleteCategoryAsync(categoryId);
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
                    Message = "Category deleted successfully",
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

        public async Task<List<SelectResDto>> GetParentsAsync()
        {
            var parent = await categoryRepo.GetAllCategoriesAsync();
            if (parent == null || parent.Count == 0)
            {
                return [];
            }

            var parentDtos = parent.Select(par => new SelectResDto
            {
                Id = par.CategoryId,
                Name = par.Name,
            }).ToList();

            return parentDtos;
        }
    }

}
