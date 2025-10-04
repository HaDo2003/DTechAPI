using DTech.Application.DTOs.response.admin;
using DTech.Application.DTOs.Response.Admin.Feedback;
using DTech.Application.Interfaces;
using DTech.Domain.Interfaces;

namespace DTech.Application.Services
{
    public class FeedbackService(
        IFeedbackRepository fbRepo
    ) : IFeedbackService
    {
        public async Task<IndexResDto<List<FeedbackIndexDto>>> GetFeedbacks()
        {
            var feedbacks = await fbRepo.GetAllFeedbacksAsync();
            if (feedbacks == null || feedbacks.Count == 0)
            {
                return new IndexResDto<List<FeedbackIndexDto>>
                {
                    Success = false,
                    Message = "No feedback found"
                };
            }
            var fbDtos = feedbacks.Select(fb => new FeedbackIndexDto
            {
                Id = fb.FeedbackId,
                Name = fb.Name,
                Message = fb.Detail,
                Fbdate = fb.Fbdate
            }).ToList();

            return new IndexResDto<List<FeedbackIndexDto>>
            {
                Success = true,
                Data = fbDtos
            };
        }
        public async Task<IndexResDto<FeedbackDetailDto>> GetFeedbackDetailAsync(int feedbackId)
        {
            var feedback = await fbRepo.GetFeedbackByIdAsync(feedbackId);
            if (feedback == null)
            {
                return new IndexResDto<FeedbackDetailDto>
                {
                    Success = false,
                    Message = "Feedback not found"
                };
            }
            var fbDetail = new FeedbackDetailDto
            {
                Name = feedback.Name,
                Email = feedback.Email,
                PhoneNumber = feedback.PhoneNumber,
                Message = feedback.Detail,
                Fbdate = feedback.Fbdate
            };

            return new IndexResDto<FeedbackDetailDto>
            {
                Success = true,
                Data = fbDetail
            };
        }
    }
}
