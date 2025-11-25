namespace DTech.Application.Interfaces
{
    public interface IUnitOfWorkService
    {
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}
