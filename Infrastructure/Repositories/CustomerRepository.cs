using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace DTech.Infrastructure.Repositories
{
    public class CustomerRepository(
        DTechDbContext context,
        UserManager<ApplicationUser> userManager
    ) : ICustomerRepository
    {
        //For User table
        public async Task<List<ApplicationUser>?> GetAllCustomersAsync()
        {
            var customer = await userManager.GetUsersInRoleAsync("Customer");
            if (customer == null || customer.Count == 0)
                return [];

            return [.. customer];
        }
        public async Task<bool> CheckAccountAsync(string? account)
        {
            return await context.Users.AnyAsync(e => e.UserName == account);
        }
        public async Task<bool> CheckEmailAsync(string? email)
        {
            return await context.Users.AnyAsync(e => e.Email == email);
        }

        public async Task<bool> CheckPhoneAsync(string? phone)
        {
            return await context.Users.AnyAsync(e => e.PhoneNumber == phone);
        }
        public async Task<bool> CheckEmailAsync(string? email, string? Id)
        {
            return await context.Users.AnyAsync(e => e.Email == email && e.Id != Id);
        }
        public async Task<bool> CheckPhoneAsync(string? phone, string? Id)
        {
            return await context.Users.AnyAsync(e => e.PhoneNumber == phone && e.Id != Id);
        }

        public async Task<ApplicationUser> GetCustomerByIdAsync(string? customerId)
        {
            ArgumentNullException.ThrowIfNull(customerId);

            var customer = await userManager.FindByIdAsync(customerId);
            if (customer != null)
            {
                customer.CustomerAddresses = await context.CustomerAddresses
                    .AsNoTracking()
                    .Where(ca => ca.CustomerId == customerId)
                    .ToListAsync();

                customer.Orders = await context.Orders
                    .AsNoTracking()
                    .Include(o => o.Status)
                    .Where(o => o.CustomerId == customerId)
                    .OrderByDescending(o => o.OrderDate)
                    .ToListAsync();

                customer.CustomerCoupons = await context.CustomerCoupons
                    .AsNoTracking()
                    .Where(cc => cc.CustomerId == customerId)
                    .ToListAsync();

                customer.Wishlists = await context.WishLists
                    .AsNoTracking()
                    .Where(w => w.CustomerId == customerId)
                    .ToListAsync();

                return customer;
            }
            else
            {
                throw new InvalidOperationException($"Customer with ID '{customerId}' not found.");
            }
        }

        public async Task<ApplicationUser?> GetOnlyCustomerByIdAsync(string? userId)
        {
            if (string.IsNullOrEmpty(userId))
                return null;
            return await userManager.FindByIdAsync(userId);
        }
        public async Task<bool> UpdateCustomerAsync(ApplicationUser customer)
        {
            if (customer == null)
                return false;

            var existingUser = await context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == customer.Id);

            if (existingUser == null)
                return false;

            // Create a new entity with only the fields we want to update
            var userToUpdate = new ApplicationUser
            {
                Id = customer.Id,
                FullName = customer.FullName,
                Email = customer.Email,
                PhoneNumber = customer.PhoneNumber,
                Image = customer.Image,
                Gender = customer.Gender,
                DateOfBirth = customer.DateOfBirth,
                ConcurrencyStamp = existingUser.ConcurrencyStamp
            };

            // Attach and mark only specific properties as modified
            context.Users.Attach(userToUpdate);
            context.Entry(userToUpdate).Property(u => u.FullName).IsModified = true;
            context.Entry(userToUpdate).Property(u => u.Email).IsModified = true;
            context.Entry(userToUpdate).Property(u => u.PhoneNumber).IsModified = true;
            context.Entry(userToUpdate).Property(u => u.Image).IsModified = true;
            context.Entry(userToUpdate).Property(u => u.Gender).IsModified = true;
            context.Entry(userToUpdate).Property(u => u.DateOfBirth).IsModified = true;

            await context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateCustomerPasswordAsync(string customerId, string? oldPassword, string? newPassword)
        {
            if (string.IsNullOrEmpty(oldPassword) || string.IsNullOrEmpty(newPassword))
            {
                return false;
            }

            // Get fresh user instance without tracked entities
            var freshUser = await userManager.FindByIdAsync(customerId);
            if (freshUser == null)
                return false;

            var result = await userManager.ChangePasswordAsync(freshUser, oldPassword, newPassword);
            return result.Succeeded;
        }

        public async Task<bool> CheckCustomerAsync(string? customerId)
        {
            return await context.Users.AnyAsync(c => c.Id == customerId);
        }
        public async Task<List<ApplicationUser>?> GetRecentCustomersAsync(int number)
        {
            var customers = await userManager.GetUsersInRoleAsync("Customer");
            if (customers == null || customers.Count == 0)
                return null;
            var recentCustomers = customers
                .OrderByDescending(c => c.CreateDate)
                .Take(number)
                .ToList();
            return recentCustomers;
        }
        //For CustomerAddress table
        public async Task<bool> CreateCustomerAddressAsync(CustomerAddress customerAddress)
        {
            if (customerAddress != null)
            {
                context.CustomerAddresses.Add(customerAddress);
                await context.SaveChangesAsync();
                return true;
            }
            return false;
        }
        public async Task<int?> AddAddressAsync(CustomerAddress model)
        {
            if (model != null)
            {
                if (model.IsDefault)
                {
                    var existingAddresses = await context.CustomerAddresses
                        .Where(a => a.CustomerId == model.CustomerId)
                        .ToListAsync();

                    foreach (var addr in existingAddresses)
                    {
                        addr.IsDefault = false;
                    }
                }
                context.CustomerAddresses.Add(model);
                await context.SaveChangesAsync();
                return model.AddressId;
            }
            return null;
        }
        public async Task<bool> EditAddressAsync(CustomerAddress model)
        {
            if (model != null)
            {
                if (model.IsDefault)
                {
                    var otherAddresses = await context.CustomerAddresses
                        .Where(a => a.CustomerId == model.CustomerId && a.AddressId != model.AddressId)
                        .ToListAsync();

                    foreach (var addr in otherAddresses)
                    {
                        addr.IsDefault = false;
                    }
                }
                context.CustomerAddresses.Update(model);
                await context.SaveChangesAsync();
                return true;
            }
            return false;
        }
        public async Task<bool> DeleteAddressAsync(string customerId, int addressId)
        {
            var customerAddress = await context
                .CustomerAddresses
                .FirstOrDefaultAsync(ca => ca.AddressId == addressId && ca.CustomerId == customerId);
            if (customerAddress != null)
            {
                try
                {
                    context.CustomerAddresses.Remove(customerAddress);
                    await context.SaveChangesAsync();
                    return true;
                }
                catch (DbUpdateConcurrencyException)
                {
                    return false;
                }
                catch (DbUpdateException)
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        public async Task<List<CustomerAddress>> GetAllAddressesByCustomerIdAsync(string customerId)
        {
            return await context.CustomerAddresses
                .AsNoTracking()
                .Where(c => c.CustomerId == customerId)
                .OrderByDescending(c => c.IsDefault)
                .ToListAsync();
        }
        public async Task<CustomerAddress?> GetDefaultAddressByCustomerIdAsync(string customerId)
        {
            return await context.CustomerAddresses
                .AsNoTracking()
                .Where(c => c.CustomerId == customerId && c.IsDefault == true)
                .FirstOrDefaultAsync();
        }
        public async Task<bool> SetDefaultAddressAsync(string customerId, int addressId)
        {
            var addresses = await context.CustomerAddresses
                .Where(c => c.CustomerId == customerId)
                .ToListAsync();

            if (addresses.Count == 0)
                return false;

            foreach (var addr in addresses)
            {
                addr.IsDefault = (addr.AddressId == addressId);
            }

            await context.SaveChangesAsync();
            return true;
        }

        //For Cart table
        public async Task<bool> CreateCartAsync(Cart cart)
        {
            if (cart != null)
            {
                context.Carts.Add(cart);
                await context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        //For feedback table
        public async Task<bool> SendContactAsync(Feedback model)
        {
            if(model != null)
            {
                context.Feedbacks.Add(model);
                await context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        // For wishlist table
        public async Task<bool> CheckWishlistAsync(string customerId, int productId)
        {
            return await context.WishLists.AnyAsync(w => w.CustomerId == customerId && w.ProductId == productId);
        }
        public async Task<bool> AddProductToWishlistAsync(string? customerId, int? productId)
        {
            if(customerId != null && productId != null)
            {
                WishList wl = new()
                {
                    CustomerId = customerId,
                    ProductId = productId,
                };
                context.WishLists.Add(wl);
                await context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<List<WishList>> GetAllWishlistByCustomerIdAync(string? customerId)
        {
            if (customerId == null)
                return [];

            return await context.WishLists.
                Where(w => w.CustomerId == customerId)
                .OrderByDescending(w => w.WishListId)
                .ToListAsync();
        }

        public async Task<bool> RemoveProductFromWishlistAsync(string? customerId, int? productId)
        {
            if(customerId == null || productId == null)
                return false;

            var wishlist = await context
                .WishLists
                .FirstOrDefaultAsync(w => w.CustomerId == customerId && w.ProductId == productId);

            if (wishlist != null)
            {
                try
                {
                    context.WishLists.Remove(wishlist);
                    await context.SaveChangesAsync();
                    return true;
                }
                catch (DbUpdateConcurrencyException)
                {
                    return false;
                }
                catch (DbUpdateException)
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }

        // For Search History
        public async Task SaveSearchHistory(string customerId, string query)
        {
            if (customerId != null)
            {
                SearchHistory model = new()
                {
                    UserId = customerId,
                    SearchTerm = query,
                    SearchDate = DateTime.UtcNow
                };
                context.SearchHistories.Add(model);
                await context.SaveChangesAsync();
            }
        }
    }
}
