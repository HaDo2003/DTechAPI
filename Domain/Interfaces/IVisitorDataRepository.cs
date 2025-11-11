using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface IVisitorDataRepository
    {
        // For Visitor Count Management
        Task<VisitorCount?> GetVisitorCountByDateAsync(DateOnly date);
        Task<VisitorCount> CreateVisitorCountAsync(VisitorCount visitorCount);
        Task<VisitorCount> UpdateVisitorCountAsync(VisitorCount visitorCount);
        Task<T> ExecuteInTransactionAsync<T>(Func<Task<T>> operation);
        Task<List<VisitorCount>?> GetVisitorCountAsync();
    }
}
