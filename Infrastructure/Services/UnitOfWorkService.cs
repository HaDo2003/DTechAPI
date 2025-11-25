using DTech.Application.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Storage;

namespace DTech.Infrastructure.Services
{
    public class UnitOfWorkService(DTechDbContext context) : IUnitOfWorkService
    {
        private IDbContextTransaction? transaction;

        public async Task BeginTransactionAsync()
        {
            transaction = await context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            if (transaction != null)
            {
                await transaction.CommitAsync();
                transaction.Dispose();
                transaction = null;
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (transaction != null)
            {
                await transaction.RollbackAsync();
                transaction.Dispose();
                transaction = null;
            }
        }
    }
}
