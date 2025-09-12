using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DTech.Infrastructure.Repositories
{
    public class PaymentMethodRepository(
        DTechDbContext context
    ) : IPaymentMethodRepository
    {
        public async Task<List<PaymentMethod>> GetListAsync()
        {
            return await context.PaymentMethods.AsNoTracking().ToListAsync();
        }
    }
}
