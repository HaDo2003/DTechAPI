using DTech.Application.DTOs.Response.Admin;
using DTech.Application.DTOs.Response.Admin.Order;
using DTech.Application.Interfaces;
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
                StatusName = order.Status != null ? order.Status.Description : string.Empty,
                Email = order.Email,
                BillingName = order.Name,
                BillingPhone = order.Phone,
                BillingAddress = order.Address,
                ShippingName = order.NameReceive ?? order.Name,
                ShippingPhone = order.PhoneReceive ?? order.Phone,
                ShippingAddress = order.ShippingAddress ?? order.Address,
                OrderDate = order.OrderDate,
                Status = order.Status?.Description,
                Note = order.Note,
                FinalCost = order.FinalCost,
                OrderProducts = order.OrderProducts?.Select(op => new OrderProductResDto
                {
                    ProductId = op.Product.ProductId,
                    ProductName = op.Product?.Name,
                    Quantity = op.Quantity,
                    Price = op.Price,
                    Total = op.CostAtPurchase,
                    PromotionalGift = op.PromotionalGift
                }).ToList() ?? [],

                Payment = order.Payment == null ? null : new PaymentResDto
                {
                    Method = order.Payment.PaymentMethod?.Description,
                    Status = order.Payment.Status
                }
            };

            return new IndexResDto<OrderDetailDto>
            {
                Success = true,
                Data = orderDetail
            };
        }
        public async Task<IndexResDto<string>> UpdateOrderStatusAsync(string orderId, string? statusName)
        {
            var order = await orderRepo.GetOrderByIdAsync(orderId);
            if (order == null)
            {
                return new IndexResDto<string>
                {
                    Success = false,
                    Message = "Order not found"
                };
            }

            if(statusName == null)
            {
                return new IndexResDto<string>
                {
                    Success = false,
                    Message = "Status not found"
                };
            }

            var result = await orderRepo.UpdateOrderStatusAsync(order, statusName);
            if(!result)
            {
                return new IndexResDto<string>
                {
                    Success = false,
                    Message = "Update order status fail"
                };
            }

            return new IndexResDto<string>
            {
                Success = true,
                Message = "Update order status successfully"
            };
        }
    }
}
