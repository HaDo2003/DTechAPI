using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DTech.Infrastructure.Repositories
{
    public class OrderRepository(
        DTechDbContext context
    ) : IOrderRepository
    {
        public async Task<Order?> AddAsync(Order order)
        {
            try
            {
                context.Orders.Add(order);
                await context.SaveChangesAsync();
                return order;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<List<OrderProduct>?> AddOrderDetailAsync(List<OrderProduct> orderDetails)
        {
            try
            {
                context.OrderProducts.AddRange(orderDetails);
                await context.SaveChangesAsync();
                return orderDetails;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<bool> AddOrderCouponAsync(string reductionCode, string orderId)
        {
            try
            {
                var coupon = await context.Coupons.FirstOrDefaultAsync(c => c.Code == reductionCode);
                if (coupon == null)
                {
                    return false;
                }

                OrderCoupon orderCoupon = new()
                {
                    OrderId = orderId,
                    CouponId = coupon.CouponId
                };

                context.OrderCoupons.Add(orderCoupon);
                await context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        public async Task<Order?> GetOrderByIdAsync(string? orderId)
        {
            try
            {
                if(orderId == null) return null;
                return await context.Orders
                    .Include(o => o.Payment).ThenInclude(p => p.PaymentMethod)
                    .Include(o => o.OrderProducts).ThenInclude(op => op.Product)
                    .FirstOrDefaultAsync(o => o.OrderId == orderId);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<Order?> GetOrderDetailAsync(string customerId, string orderId)
        {
            try
            {
                if (orderId == null) return null;
                return await context.Orders
                    .Include(o => o.Status)
                    .Include(o => o.Payment).ThenInclude(p => p.PaymentMethod)
                    .Include(o => o.OrderProducts).ThenInclude(op => op.Product)
                    .FirstOrDefaultAsync(o => o.OrderId == orderId && o.CustomerId == customerId);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }
    }
}
