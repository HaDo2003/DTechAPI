using DTech.Domain.Entities;
using DTech.Domain.Enums;
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
                .Where(a => a.Status == StatusEnums.Available)
                .OrderBy(a => a.Order)
                .ToListAsync();
        }

        public async Task<List<Advertisement>?> GetAllAdvertisementsAsync()
        {
            return await context.Advertisements
                .AsNoTracking()
                .Where(a => a.Status == StatusEnums.Available)
                .OrderBy(a => a.AdvertisementId)
                .ToListAsync();
        }
        public async Task<Advertisement?> GetAdvertisementByIdAsync(int advertisementId)
        {
            if (advertisementId <= 0)
                return null;

            return await context.Advertisements.FindAsync(advertisementId);
        }
        public async Task<bool> CheckIfAdsExistsAsync(Advertisement advertisement)
        {
            if (advertisement == null)
                return false;

            if (advertisement.AdvertisementId > 0)
            {
                return await context.Advertisements.AnyAsync(a =>
                    a.Slug == advertisement.Slug &&
                    a.AdvertisementId != advertisement.AdvertisementId);
            }
            else
            {
                return await context.Advertisements.AnyAsync(a =>
                    a.Slug == advertisement.Slug);
            }
        }
        public async Task<(bool Success, string Message)> CreateAdvertisementAsync(Advertisement advertisement)
        {
            if (advertisement == null)
                return (false, "Advertisement is null");

            await context.Advertisements.AddAsync(advertisement);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Advertisement created successfully");
            else
                return (false, "Failed to create advertisement");
        }
        public async Task<(bool Success, string Message)> UpdateAdvertisementAsync(Advertisement advertisement)
        {
            var existingAd = await context.Advertisements.FindAsync(advertisement.AdvertisementId);
            if (existingAd == null)
                return (false, "Advertisement not found");

            existingAd.Name = advertisement.Name;
            existingAd.Slug = advertisement.Slug;
            existingAd.Order = advertisement.Order;
            existingAd.Status = advertisement.Status;
            existingAd.Image = advertisement.Image;
            existingAd.UpdateDate = DateTime.UtcNow;
            existingAd.UpdatedBy = advertisement.UpdatedBy;

            context.Advertisements.Update(existingAd);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Advertisement updated successfully");
            else
                return (false, "Failed to update advertisement");
        }
        public async Task<(bool Success, string Message)> DeleteAdvertisementAsync(int advertisementId)
        {
            var advertisement = await context.Advertisements.FindAsync(advertisementId);
            if (advertisement == null)
                return (false, "Advertisement not found");

            context.Advertisements.Remove(advertisement);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Advertisement deleted successfully");
            else
                return (false, "Failed to delete advertisement");
        }
    }
}
