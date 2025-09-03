using DTech.Application.DTOs.request;
using DTech.Application.DTOs.response;

namespace DTech.Application.Interfaces
{
    public interface ICustomerService
    {
        Task<CustomerDto> GetCustomer(string customerId);
        Task<MessageResponse> UpdateCustomerProfile(string customerId, UpdateProfileDto model);
    }
}
