using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DTech.Infrastructure.Repositories
{
    public class CustomerRepository(DTechDbContext context) : ICustomerRepository
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
