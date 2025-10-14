using DTech.Application.DTOs.Response.Admin;
using DTech.Application.DTOs.Response.Admin.Order;
using DTech.Domain.Entities;

namespace DTech.Application.Interfaces
{
    public interface IOrderService
    {
        Task<IndexResDto<List<OrderIndexDto>>> GetOrders();
        Task<IndexResDto<OrderDetailDto>> GetOrderDetailAsync(string orderId);
        Task<IndexResDto<string>> UpdateOrderStatusAsync(string orderId, string? statusName);
    }
}
