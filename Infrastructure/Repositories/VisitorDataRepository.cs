using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DTech.Infrastructure.Repositories
{
    public class VisitorDataRepository(DTechDbContext context) : IVisitorDataRepository
    {
        // For Visitor Count Management
        public async Task<VisitorCount?> GetVisitorCountByDateAsync(DateOnly date)
        {
            return await context.VisitorCounts
                .FirstOrDefaultAsync(vc => vc.Date == date);
        }

        public async Task<VisitorCount> CreateVisitorCountAsync(VisitorCount visitorCount)
        {
            context.VisitorCounts.Add(visitorCount);
            await context.SaveChangesAsync();
            return visitorCount;
        }

        public async Task<VisitorCount> UpdateVisitorCountAsync(VisitorCount visitorCount)
        {
            context.VisitorCounts.Update(visitorCount);
            await context.SaveChangesAsync();
            return visitorCount;
        }

        public async Task<T> ExecuteInTransactionAsync<T>(Func<Task<T>> operation)
        {
            var strategy = context.Database.CreateExecutionStrategy();

            return await strategy.ExecuteAsync(async () =>
            {
                using var transaction = await context.Database.BeginTransactionAsync(System.Data.IsolationLevel.Serializable);
                try
                {
                    var result = await operation();
                    await transaction.CommitAsync();
                    return result;
                }
                catch
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            });
        }

        public async Task<List<VisitorCount>?> GetVisitorCountAsync()
        {
            var today = DateOnly.FromDateTime(DateTime.Now);
            var currentWeek = System.Globalization.CultureInfo.InvariantCulture.Calendar.GetWeekOfYear(
                DateTime.Now,
                System.Globalization.CalendarWeekRule.FirstDay,
                DayOfWeek.Monday
            );

            var fourWeeksAgo = currentWeek - 3;

            return await context.VisitorCounts
                .Where(vc => vc.Week >= fourWeeksAgo && vc.Week <= currentWeek)
                .OrderBy(vc => vc.Date)
                .ToListAsync();
        }
    }
}
