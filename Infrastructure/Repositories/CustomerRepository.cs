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
            if (customerId == null)
            {
                throw new ArgumentNullException(nameof(customerId));
            }

            var customer = await userManager.FindByIdAsync(customerId);
            if (customer != null)
            {
                customer.CustomerAddresses = await context.CustomerAddresses
                    .AsNoTracking()
                    .Where(ca => ca.CustomerId == customerId)
                    .ToListAsync();

                customer.Orders = await context.Orders
                    .AsNoTracking()
                    .Where(o => o.CustomerId == customerId)
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
        public async Task<bool> UpdateCustomerAsync(ApplicationUser customer)
        {
            if (customer == null)
                return false;

            var existingUser = await context.Users.FindAsync(customer.Id);

            if (existingUser == null)
                return false;

            // Update only allowed fields
            existingUser.FullName = customer.FullName;
            existingUser.Email = customer.Email;
            existingUser.PhoneNumber = customer.PhoneNumber;
            existingUser.Image = customer.Image;
            existingUser.Gender = customer.Gender;
            existingUser.DateOfBirth = customer.DateOfBirth;

            await context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateCustomerPasswordAsync(ApplicationUser customer, string? oldPassword, string? newPassword)
        {
            if (string.IsNullOrEmpty(oldPassword) || string.IsNullOrEmpty(newPassword))
            {
                return false;
            }

            var result = await userManager.ChangePasswordAsync(customer, oldPassword, newPassword);
            return result.Succeeded;
        }

        public async Task<bool> CheckCustomerAsync(string? customerId)
        {
            return await context.Users.AnyAsync(c => c.Id == customerId);
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
                .Where(c => c.CustomerId == customerId)
                .OrderByDescending(c => c.IsDefault)
                .ToListAsync();
        }
        public async Task<CustomerAddress?> GetDefaultAddressByCustomerIdAsync(string customerId)
        {
            return await context.CustomerAddresses
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
    }
}
