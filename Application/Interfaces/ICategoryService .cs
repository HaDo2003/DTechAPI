using DTech.Application.DTOs.response.admin;
using DTech.Application.DTOs.Response.Admin.Category;

namespace DTech.Application.Interfaces
{
    public interface ICategoryService
    {
        Task<IndexResDto<List<CategoryIndexDto>>> GetCategoriesAsync();
        Task<IndexResDto<CategoryDetailDto>> GetCategoryDetailAsync(int categoryId);
        Task<IndexResDto<object?>> CreateCategoryAsync(CategoryDetailDto model, string? currentUserId);
        Task<IndexResDto<object?>> UpdateCategoryAsync(int categoryId, CategoryDetailDto model, string? currentUserId);
        Task<IndexResDto<object?>> DeleteCategoryAsync(int categoryId);
        Task<List<ParentResDto>> GetParentsAsync();
    }
}
