using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface ICustomerRepository
    {
        //For User table
        Task<bool> CheckAccountAsync(string? account);
        //Check when create new account
        Task<bool> CheckEmailAsync(string? email);
        Task<bool> CheckPhoneAsync(string? phone);
        //Check when update profile
        Task<bool> CheckEmailAsync(string? email, string? Id);
        Task<bool> CheckPhoneAsync(string? phone, string? Id);
        Task<ApplicationUser> GetCustomerByIdAsync(string? customerId);
        Task<bool> UpdateCustomerAsync(ApplicationUser customer);

        //For CustomerAddress table
        Task<bool> CreateCustomerAddressAsync(CustomerAddress customerAddress);
        //For Cart table
        Task<bool> CreateCartAsync(Cart cart);
    }
}
