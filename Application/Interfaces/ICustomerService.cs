using DTech.Application.DTOs.response;

namespace DTech.Application.Interfaces
{
    public interface ICustomerService
    {
        Task<CustomerDto> GetCustomer(string customerId);
    }
}
