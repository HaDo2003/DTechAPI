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
        Task<bool> UpdateCustomerPasswordAsync(ApplicationUser customer, string? oldPassword, string? newPassword);
        Task<bool> CheckCustomerAsync(string? customerId);

        //For CustomerAddress table
        Task<bool> CreateCustomerAddressAsync(CustomerAddress customerAddress);
        Task<int?> AddAddressAsync(CustomerAddress model);
        Task<bool> EditAddressAsync(CustomerAddress model);
        Task<bool> DeleteAddressAsync(string customerId, int addressId);
        Task<List<CustomerAddress>> GetAllAddressesByCustomerIdAsync(string customerId);
        Task<CustomerAddress?> GetDefaultAddressByCustomerIdAsync(string customerId);
        Task<bool> SetDefaultAddressAsync(string customerId, int addressId);
        //For Cart table
        Task<bool> CreateCartAsync(Cart cart);
        // For Feedback table
        Task<bool> SendContactAsync(Feedback model);
    }
}
