using DTech.Application.DTOs.response.admin;
using DTech.Application.DTOs.response.admin.advertisement;
using DTech.Application.DTOs.Response.Admin.Order;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;

namespace DTech.Application.Services
{
    public class OrderService(
        IOrderRepository orderRepo
    ) : IOrderService
    {
        public async Task<IndexResDto<List<OrderIndexDto>>> GetOrders()
        {
            var orders = await orderRepo.GetAllOrdersAsync();
            if (orders == null || orders.Count == 0)
            {
                return new IndexResDto<List<OrderIndexDto>>
                {
                    Success = false,
                    Message = "No order found"
                };
            }

            var orderDtos = orders.Select(order => new OrderIndexDto
            {
                Id = order.OrderId,
                BillingName = order.Name,
                OrderDate = order.OrderDate,
                FinalCost = order.FinalCost,
                Status = order.Status?.Description,
                Note = order.Note,
            }).ToList();

            return new IndexResDto<List<OrderIndexDto>>
            {
                Success = true,
                Data = orderDtos
            };
        }
        public async Task<IndexResDto<OrderDetailDto>> GetOrderDetailAsync(string orderId)
        {
            var order = await orderRepo.GetOrderByIdAsync(orderId);
            if (order == null)
            {
                return new IndexResDto<OrderDetailDto>
                {
                    Success = false,
                    Message = "Order not found"
                };
            }
            var orderDetail = new OrderDetailDto
            {
                Id = order.OrderId,
                BillingName = order.Name,
                BillingPhone = order.Phone,
                BillingAddress = order.Address,
                ShippingName = order.NameReceive,
                ShippingPhone = order.PhoneReceive,
                ShippingAddress = order.ShippingAddress,
                OrderDate = order.OrderDate,
                Status = order.Status?.Description,
                Note = order.Note,
                FinalCost = order.FinalCost,
            };

            return new IndexResDto<OrderDetailDto>
            {
                Success = true,
                Data = orderDetail
            };
        }
    }
}
