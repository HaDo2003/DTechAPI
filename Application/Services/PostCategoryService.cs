using DTech.Application.DTOs.response.admin;
using DTech.Application.DTOs.Response.Admin.PostCategory;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;

namespace DTech.Application.Services
{
    public class PostCategoryService(
        IPostCategoryRepository postCategoryRepo,
        IAdminRepository adminRepo
    ) : IPostCategoryService
    {
        public async Task<IndexResDto<List<PostCategoryIndexDto>>> GetPostCategoriesAsync()
        {
            var categories = await postCategoryRepo.GetAllPostCategoriesAsync();
            if (categories == null || categories.Count == 0)
            {
                return new IndexResDto<List<PostCategoryIndexDto>>
                {
                    Success = false,
                    Message = "No post category found"
                };
            }

            var categoryDtos = categories.Select(cat => new PostCategoryIndexDto
            {
                Id = cat.CategoryId,
                Name = cat.Name,
                Slug = cat.Slug,
            }).ToList();

            return new IndexResDto<List<PostCategoryIndexDto>>
            {
                Success = true,
                Data = categoryDtos
            };
        }

        public async Task<IndexResDto<PostCategoryDetailDto>> GetPostCategoryDetailAsync(int postCategoryId)
        {
            var category = await postCategoryRepo.GetPostCategoryByIdAsync(postCategoryId);
            if (category == null)
            {
                return new IndexResDto<PostCategoryDetailDto>
                {
                    Success = false,
                    Message = "Post category not found"
                };
            }

            var categoryDetail = new PostCategoryDetailDto
            {
                Name = category.Name,
                Slug = category.Slug,
                CreateDate = category.CreateDate,
                CreatedBy = category.CreatedBy,
                UpdateDate = category.UpdateDate,
                UpdatedBy = category.UpdatedBy
            };

            return new IndexResDto<PostCategoryDetailDto>
            {
                Success = true,
                Data = categoryDetail
            };
        }

        public async Task<IndexResDto<object?>> CreatePostCategoryAsync(PostCategoryDetailDto model, string? currentUserId)
        {
            try
            {
                PostCategory category = new()
                {
                    Name = model.Name,
                    Slug = model.Slug,
                    CreateDate = DateTime.UtcNow,
                    CreatedBy = await adminRepo.GetAdminFullNameAsync(currentUserId),
                };

                category.Slug = category.Name?.ToLower().Replace(" ", "-").Replace("/", "-");

                var exists = await postCategoryRepo.CheckIfPostCategoryExistsAsync(category);
                if (exists)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = "Post category with same name exists",
                        Data = null
                    };
                }

                var (Success, Message) = await postCategoryRepo.CreatePostCategoryAsync(category);

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
                    Message = "Post category created successfully",
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

        public async Task<IndexResDto<object?>> UpdatePostCategoryAsync(int postCategoryId, PostCategoryDetailDto model, string? currentUserId)
        {
            try
            {
                PostCategory category = new()
                {
                    CategoryId = postCategoryId,
                    Name = model.Name,
                    UpdateDate = DateTime.UtcNow,
                    UpdatedBy = await adminRepo.GetAdminFullNameAsync(currentUserId),
                };

                string newSlug = model.Name?.ToLower().Replace(" ", "-").Replace("/", "-") ?? string.Empty;
                category.Slug = newSlug;

                var exists = await postCategoryRepo.CheckIfPostCategoryExistsAsync(category);
                if (exists)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = "Post category with the same name already exists",
                        Data = null
                    };
                }

                var (Success, Message) = await postCategoryRepo.UpdatePostCategoryAsync(category);
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
                    Message = "Post category updated successfully",
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

        public async Task<IndexResDto<object?>> DeletePostCategoryAsync(int postCategoryId)
        {
            try
            {
                var (Success, Message) = await postCategoryRepo.DeletePostCategoryAsync(postCategoryId);
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
                    Message = "Post category deleted successfully",
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
