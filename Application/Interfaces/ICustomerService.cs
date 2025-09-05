using DTech.Application.DTOs.request;
using DTech.Application.DTOs.response;

namespace DTech.Application.Interfaces
{
    public interface ICustomerService
    {
        Task<CustomerDto> GetCustomer(string customerId);
        Task<MessageResponse> UpdateCustomerProfile(string customerId, UpdateProfileDto model);
        Task<MessageResponse> UpdateNewPasswordAsync(string customerId, ChangePasswordDto model);
        Task<AddressResponse> AddAddressAsync(string customerId, AddAddressDto model);
        Task<MessageResponse> EditAddressAsync(string customerId, EditAddressDto model);
        Task<MessageResponse> DeleteAddressAsync(string customerId, int addressId);
        Task<MessageResponse> SendContactAsync(ContactDto model);
    }
}
