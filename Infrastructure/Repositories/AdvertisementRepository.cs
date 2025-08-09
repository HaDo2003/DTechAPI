using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DTech.Infrastructure.Repositories
{
    public class AdvertisementRepository(DTechDbContext context) : IAdvertisementRepository
    {
        public async Task<List<Advertisement>> GetOrderedListAsync()
        {
            return await context.Advertisements
                .AsNoTracking()
                .Where(a => a.Status == 1)
                .OrderBy(a => a.Order)
                .ToListAsync();
        }
    }
}
