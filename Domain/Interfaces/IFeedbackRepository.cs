using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface IFeedbackRepository
    {
        Task<List<Feedback>> GetAllFeedbacksAsync();
        Task<Feedback?> GetFeedbackByIdAsync(int feedbackId);
    }
}
