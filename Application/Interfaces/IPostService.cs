using DTech.Application.DTOs.response.admin;
using DTech.Application.DTOs.Response.Admin.Post;

namespace DTech.Application.Interfaces
{
    public interface IPostService
    {
        Task<IndexResDto<List<PostIndexDto>>> GetPostsAsync();
        Task<IndexResDto<PostDetailDto>> GetPostDetailAsync(int postId);
        Task<IndexResDto<object?>> CreatePostAsync(PostDetailDto model, string? currentUserId);
        Task<IndexResDto<object?>> UpdatePostAsync(int postId, PostDetailDto model, string? currentUserId);
        Task<IndexResDto<object?>> DeletePostAsync(int postId);
    }
}
