using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface ICustomerRepository
    {
        //For User table
        Task<bool> CheckAccountAsync(string? account);
        Task<bool> CheckEmailAsync(string? email);
        Task<bool> CheckPhoneAsync(string? phone);
        Task<ApplicationUser> GetCustomerByIdAsync(string? customerId);

        //For CustomerAddress table
        Task<bool> CreateCustomerAddressAsync(CustomerAddress customerAddress);
        //For Cart table
        Task<bool> CreateCartAsync(Cart cart);
    }
}
