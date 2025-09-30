using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order?> AddAsync(Order order);
        Task<List<OrderProduct>?> AddOrderDetailAsync(List<OrderProduct> orderDetails);

        Task<bool> AddOrderCouponAsync(string reductionCode, string orderId);
        Task<Order?> GetOrderByIdAsync(string? orderId);
        Task<Order?> GetOrderDetailAsync(string customerId, string orderId);
        Task<List<Order>?> GetAllOrdersAsync();

    }
}
