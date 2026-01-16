using DTech.Application.DTOs.Response.Admin;
using DTech.Application.DTOs.Response.Admin.PostCategory;

namespace DTech.Application.Interfaces
{
    public interface IPostCategoryService
    {
        Task<IndexResDto<List<PostCategoryIndexDto>>> GetPostCategoriesAsync();
        Task<IndexResDto<PostCategoryDetailDto>> GetPostCategoryDetailAsync(int categoryId);
        Task<IndexResDto<object?>> CreatePostCategoryAsync(PostCategoryDetailDto model, string? currentUserId);
        Task<IndexResDto<object?>> UpdatePostCategoryAsync(int categoryId, PostCategoryDetailDto model, string? currentUserId);
        Task<IndexResDto<object?>> DeletePostCategoryAsync(int categoryId);
    }
}
