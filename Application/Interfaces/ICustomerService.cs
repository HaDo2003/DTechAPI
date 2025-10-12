using DTech.Application.DTOs.request;
using DTech.Application.DTOs.response;
using DTech.Application.DTOs.Response.Admin;
using DTech.Application.DTOs.Response.Admin.Customer;

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
        Task<AddressResponse> SwitchDefaultAsync(string customerId, int addressId);
        Task<OrderDetailResDto> GetOrderDetailAsync(string customerId, string orderId);
        Task<MessageResponse> AddProductToWishlistAsync(string customerId, int productId);
        Task<IndexResDto<List<WishlistDto>>> GetWishlistAsync(string customerId);
        Task<MessageResponse> RemoveProductFromWishlistAsync(string customerId, int productId);

        // For Admin
        Task<IndexResDto<List<CustomerIndexDto>>> GetCustomersAsync();
        Task<IndexResDto<CustomerDetailDto>> GetCustomerDetailAsync(string customerId);
    }
}
