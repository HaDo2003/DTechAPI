using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

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
    }
}
