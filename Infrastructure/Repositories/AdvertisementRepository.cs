using DTech.Domain.Entities;
using DTech.Domain.Enums;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using EFCore.BulkExtensions;

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
                .OrderBy(a => a.AdvertisementId)
                .ToListAsync();
        }
        public async Task<Advertisement?> GetAdvertisementByIdAsync(int advertisementId)
        {
            if (advertisementId <= 0)
                return null;

            return await context.Advertisements.AsNoTracking().FirstOrDefaultAsync(a => a.AdvertisementId == advertisementId);
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

            int? deletedOrder = advertisement.Order;

            context.Advertisements.Remove(advertisement);

            // Get all advertisements with order greater than the deleted one
            var advertisementsToUpdate = await context.Advertisements
                .Where(a => a.Order > deletedOrder)
                .OrderBy(a => a.Order)
                .ToListAsync();

            // Shift down the order of all affected advertisements by 1
            foreach (var adv in advertisementsToUpdate)
            {
                adv.Order -= 1;
            }

            // Perform a bulk update for the advertisements
            if (advertisementsToUpdate.Count != 0)
                await context.BulkUpdateAsync(advertisementsToUpdate);

            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Advertisement deleted successfully");
            else
                return (false, "Failed to delete advertisement");
        }
        
        public async Task<bool> UpdateOrderWhenCreateAsync(int? order)
        {
            try
            {
                // Get all advertisements that need their Order updated
                var advertisementsToUpdate = await context.Advertisements
                    .Where(a => a.Order >= order)
                    .OrderBy(a => a.Order)
                    .ToListAsync();

                // Update the Order for each advertisement
                foreach (var advertisement in advertisementsToUpdate)
                {
                    advertisement.Order += 1;
                }
                await context.BulkUpdateAsync(advertisementsToUpdate);
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        public async Task<bool> UpdateOrderWhenEditAsync(int? oldOrder, int? newOrder, int advId)
        {
            try
            {
                // If old order and new order are the same, no need to update
                if (oldOrder == newOrder) return true;

                // Get the max order in the database to prevent exceeding list length
                int maxOrder = await context.Advertisements.MaxAsync(a => (int?)a.Order) ?? 0;

                // Ensure new order doesn't exceed max order
                if (newOrder > maxOrder) newOrder = maxOrder;

                // Create a list of advertisements to update
                List<Advertisement> advertisementsToUpdate = [];

                if (oldOrder < newOrder)
                {
                    advertisementsToUpdate = await context.Advertisements
                        .Where(a => a.Order > oldOrder && a.Order <= newOrder && a.AdvertisementId != advId)
                        .ToListAsync();

                    // Decrease the order for each item in the list
                    advertisementsToUpdate.ForEach(a => a.Order -= 1);
                }
                else if (oldOrder > newOrder)
                {
                    advertisementsToUpdate = await context.Advertisements
                        .Where(a => a.Order >= newOrder && a.Order < oldOrder && a.AdvertisementId != advId)
                        .ToListAsync();

                    // Increase the order for each item in the list
                    advertisementsToUpdate.ForEach(a => a.Order += 1);
                }

                // Bulk update the order of affected advertisements
                if (advertisementsToUpdate.Any())
                {
                    await context.BulkUpdateAsync(advertisementsToUpdate);
                }

                // Now, update the target advertisement with the new order
                var advertisementToUpdate = await context.Advertisements
                    .FirstOrDefaultAsync(a => a.AdvertisementId == advId);

                if (advertisementToUpdate != null)
                {
                    advertisementToUpdate.Order = newOrder;
                    await context.BulkUpdateAsync([advertisementToUpdate]);
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        public async Task<bool> CheckOrderAsync(int? order)
        {
            return await context.Advertisements.AnyAsync(e => e.Order == order);
        }
    }
}
