using DTech.Application.DTOs.Response.Admin;
using DTech.Application.DTOs.Response.Admin.Feedback;

namespace DTech.Application.Interfaces
{
    public interface IFeedbackService
    {
        Task<IndexResDto<List<FeedbackIndexDto>>> GetFeedbacks();
        Task<IndexResDto<FeedbackDetailDto>> GetFeedbackDetailAsync(int feedbackId);
    }
}
