using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DTech.Infrastructure.Repositories
{
    public class FeedbackRepository(DTechDbContext context) : IFeedbackRepository
    {
        public async Task<List<Feedback>> GetAllFeedbacksAsync()
        {
            return await context.Feedbacks
                .AsNoTracking()
                .OrderByDescending(fb => fb.Fbdate)
                .ToListAsync();

        }
        public async Task<Feedback?> GetFeedbackByIdAsync(int feedbackId)
        {
            return await context.Feedbacks
                .AsNoTracking()
                .FirstOrDefaultAsync(fb => fb.FeedbackId == feedbackId);
        }
    }
}
