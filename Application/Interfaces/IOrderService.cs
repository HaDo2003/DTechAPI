using DTech.Application.DTOs.response.admin;
using DTech.Application.DTOs.Response.Admin.Order;

namespace DTech.Application.Interfaces
{
    public interface IOrderService
    {
        Task<IndexResDto<List<OrderIndexDto>>> GetOrders();
        Task<IndexResDto<OrderDetailDto>> GetOrderDetailAsync(string orderId);
    }
}
