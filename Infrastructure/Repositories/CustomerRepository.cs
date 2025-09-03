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
