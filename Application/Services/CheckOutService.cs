using AutoMapper;
using DTech.Application.DTOs.request;
using DTech.Application.DTOs.response;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;

namespace DTech.Application.Services
{
    public class CheckOutService(
        ICustomerRepository customerRepo,
        IOrderRepository orderRepo,
        ICartRepository cartRepo,
        IPaymentMethodRepository paymentMethodRepo,
        ICouponRepository couponRepo,
        IProductRepository productRepo,
        IShippingRepository shippingRepo,
        IPaymentRepository paymentRepo,
        IMapper mapper,
        IBackgroundTaskQueue backgroundTaskQueue,
        IEmailService emailService
    ) : ICheckOutService
    {
        // Main Methods
        public async Task<CheckOutDto> GetCheckOutAsync(string customerId)
        {
            var customer = await customerRepo.GetCustomerByIdAsync(customerId);
            if (customer == null)
                return new CheckOutDto { Success = false, Message = "Customer not found" };

            var cart = await cartRepo.GetFullCartByUserIdAsync(customerId);
            if (cart == null || cart.CartProducts.Count == 0)
                return new CheckOutDto { Success = false, Message = "Cart not found" };

            return await BuildCheckoutModelAsync(customer, cart);
        }

        public async Task<CheckOutDto> BuyNowAsync(string customerId, BuyNowReqDto modelReq)
        {
            var customer = await customerRepo.GetCustomerByIdAsync(customerId);
            if (customer == null)
                return new CheckOutDto { Success = false, Message = "Customer not found" };

            var product = await productRepo.GetProductByIdAsync(modelReq.ProductId);
            if (product == null)
                return new CheckOutDto { Success = false, Message = "Product not found" };

            // Create a temporary cart
            var tempCart = new Cart
            {
                CustomerId = customerId,
                CartProducts =
                [
                    new CartProduct
            {
                ProductId = modelReq.ProductId,
                Quantity = modelReq.Quantity,
                Product = product
            }
                ]
            };

            return await BuildCheckoutModelAsync(customer, tempCart);
        }

        public async Task<OrderSummaryResDto> ApplyCouponAsync(string code, string customerId)
        {
            var customerExists = await customerRepo.CheckCustomerAsync(customerId);
            if (!customerExists)
                return new OrderSummaryResDto { Success = false, Message = "Customer not found" };

            var cart = await cartRepo.GetFullCartByUserIdAsync(customerId);
            if (cart == null || cart.CartProducts.Count == 0)
                return new OrderSummaryResDto { Success = false, Message = "Cart not found" };

            var subTotal = cart.CartProducts.Sum(cp => cp.Product!.PriceAfterDiscount * cp.Quantity);

            return await ApplyCouponInternalAsync(code, customerId, subTotal);
        }

        public async Task<OrderSummaryResDto> ApplyCouponBuyNowAsync(string code, string customerId, int productId, int quantity)
        {
            var product = await productRepo.GetProductByIdAsync(productId);
            if (product == null)
                return new OrderSummaryResDto { Success = false, Message = "Product not found" };

            var subTotal = product.Price * quantity;

            return await ApplyCouponInternalAsync(code, customerId, subTotal);
        }
        public async Task<OrderResDto> PlaceOrderAsync(string customerId, CheckOutDto model)
        {
            var customer = await customerRepo.GetCustomerByIdAsync(customerId);
            if (customer == null)
                return new OrderResDto { Success = false, Message = "Customer not found" };

            try
            {
                Cart? cart = new();
                if (!model.IsBuyNow)
                {
                    cart = await cartRepo.GetFullCartByUserIdAsync(customerId);
                    if (cart == null || cart.CartProducts.Count == 0)
                        return new OrderResDto { Success = false, Message = "Cart not found" };
                }
                else
                {
                    cart = null;
                }


                if (model.PaymentMethod == 2)
                    return new OrderResDto { Success = false, Message = "Momo payment is under development, please try another way" };

                var (success, message, order) = await ProcessOrderAsync(customerId, model, cart);
                if (!success || order == null)
                    return new OrderResDto { Success = false, Message = message };

                SendEmail(order);

                OrderResDto result = new()
                {
                    Success = true,
                    OrderId = order?.OrderId ?? string.Empty,
                    Phone = order?.Phone,
                    Email = order?.Email,
                    Address = order?.Address,
                    ShippingAddress = order?.ShippingAddress,
                    ShippingCost = order?.ShippingCost ?? 0,
                    CostDiscount = order?.CostDiscount ?? 0,
                    TotalCost = order?.TotalCost ?? 0,
                    FinalCost = order?.FinalCost ?? 0,
                    PaymentMethod = order?.Payment?.PaymentMethod == null
                        ? null
                        : new PaymentMethodDto
                        {
                            Description = order.Payment.PaymentMethod.Description
                        },
                    OrderProducts = order?.OrderProducts?
                        .Where(op => op?.Product != null)
                        .Select(op => new OrderProductDto
                        {
                            Id = op.Id,
                            Name = op.Product.Name,
                            Photo = op.Product.Photo,
                            Quantity = op.Quantity,
                            CostAtPurchase = op.CostAtPurchase
                        }).ToList()
                };

                return result;
            }
            catch (Exception ex) {
                return new OrderResDto { Success = false, Message = ex.Message };
            }
        }

        // --- Helper Methods ---
        private async Task<CheckOutDto> BuildCheckoutModelAsync(ApplicationUser customer, Cart cart)
        {
            // Get customer addresses
            var customerAddresses = await customerRepo.GetAllAddressesByCustomerIdAsync(customer.Id);
            var customerAddressesDto = mapper.Map<List<CustomerAddressDto>>(customerAddresses);

            // Get payment methods
            var paymentMethods = await paymentMethodRepo.GetListAsync();
            var paymentMethodsDto = mapper.Map<List<PaymentMethodDto>>(paymentMethods);

            // Create order summary from cart
            var orderSummary = CreateOrderSummary(cart);

            // Build response
            var model = new CheckOutDto
            {
                Success = true,
                Email = customer.Email,
                CustomerAddresses = customerAddressesDto,
                PaymentMethods = paymentMethodsDto,
                OrderSummary = orderSummary
            };

            // Fill default address if exists
            var defaultAddress = await customerRepo.GetDefaultAddressByCustomerIdAsync(customer.Id);
            if (defaultAddress != null)
            {
                model.BillingName = defaultAddress.FullName;
                model.BillingPhone = defaultAddress.PhoneNumber;
                model.BillingAddress = defaultAddress.Address;
            }

            return model;
        }
        private static OrderSummary CreateOrderSummary(Cart cart)
        {
            if (cart == null) return new OrderSummary();

            var items = cart.CartProducts
                .Select(cp => new OrderItem
                {
                    ProductId = cp.ProductId,
                    Name = cp.Product!.Name,
                    Photo = cp.Product.Photo,
                    Quantity = cp.Quantity,
                    Price = cp.Product.PriceAfterDiscount  * cp.Quantity
                })
                .ToList();

            var orderSummary = new OrderSummary
            {
                Items = items,
                SubTotal = cart.CartProducts.Sum(cp => cp.Product!.PriceAfterDiscount * cp.Quantity),
                ShippingFee = 10m,
            };

            orderSummary.Total = orderSummary.SubTotal + orderSummary.ShippingFee;
            orderSummary.ItemCount = items.Sum(i => i.Quantity);
            return orderSummary;
        }
        private async Task<OrderSummaryResDto> ApplyCouponInternalAsync(string code, string customerId, decimal? subTotal)
        {
            code = code.ToUpper();

            // Validate customer existence
            var customer = await customerRepo.GetCustomerByIdAsync(customerId);
            if (customer == null)
                return new OrderSummaryResDto { Success = false, Message = "Customer not found" };

            // Validate discount code
            var coupon = await couponRepo.GetCouponByCode(code);
            if (coupon == null || DateOnly.FromDateTime(DateTime.UtcNow) > coupon.EndDate)
                return new OrderSummaryResDto { Success = false, Message = "Coupon does not exist or has expired" };

            // Check if discount is already applied in other orders
            var isCouponUsed = await couponRepo.CheckIsUsedAsync(customerId, coupon.CouponId);
            if (isCouponUsed)
                return new OrderSummaryResDto { Success = false, Message = "Coupon has been used" };

            // Check the condition of coupon
            if (subTotal == 0 || subTotal == null)
                return new OrderSummaryResDto { Success = false, Message = "Subtotal is zero" };

            if (subTotal < coupon.Condition)
                return new OrderSummaryResDto { Success = false, Message = $"Minimum order value for this discount is {coupon.Condition}" };

            // Calculate discount amount
            decimal? discountAmount = 0m;
            switch (coupon.DiscountType)
            {
                case "Percentage":
                    discountAmount = subTotal * coupon.Discount / 100;
                    if (coupon.MaxDiscount.HasValue && discountAmount > coupon.MaxDiscount.Value)
                        discountAmount = coupon.MaxDiscount.Value;
                    break;

                case "Direct":
                    discountAmount = coupon.Discount;
                    break;
            }

            var shippingFee = 10m;
            var total = subTotal - discountAmount + shippingFee;

            return new OrderSummaryResDto
            {
                Success = true,
                DiscountAmount = discountAmount,
                Total = total
            };
        }
        private async Task<(bool Sucess, string Message, Order? order)> ProcessOrderAsync(string customerId, CheckOutDto model, Cart? cart)
        {
            var shipping = await CreateShippingAsync();
            if (shipping == null) return (false, "Fail to create Shipping", null);

            var payment = await CreatePaymentAsync(model);
            if (payment == null) return (false, "Fail to create Payment", null);


            var order = await CreateOrderAsync(customerId, model, shipping.ShippingId, payment.PaymentId);
            if(order == null) return (false, "Fail to create Order", null);

            // For CART
            if (cart != null) 
            {
                var orderProducts = await CreateOrderDetailAsync(order, cart);
                if (orderProducts == null) return (false, "Fail to create order detail", null);

                var isClear = await cartRepo.ClearCartAsync(cart);
                if (!isClear) return (false, "Fail to clear cart", null);
            } 
            // For BUY NOW
            else
            {
                var orderProducts = await CreateOrderDetailForBuyNowAsync(order, model.OrderSummary);
                if (orderProducts == null) return (false, "Fail to create order detail", null);
            }


            if (!string.IsNullOrEmpty(model.ReductionCode))
            {
                var isUsed = await couponRepo.UseCodeAsync(model.ReductionCode, customerId);
                if (!isUsed) return (false, "Fail to add used coupon", null);

                var isAdded = await orderRepo.AddOrderCouponAsync(model.ReductionCode, order.OrderId!);
                if (!isAdded) return (false, "Fail to add used coupon to order", null);
            }

            var fetchOrder = await orderRepo.GetOrderByIdAsync(order.OrderId);
            return (true, "Process order sucessfully", fetchOrder);
        }

        private async Task<Shipping?> CreateShippingAsync()
        {
            var shipping = new Shipping
            {
                DeliveryDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(3)),
            };
            return await shippingRepo.AddAsync(shipping);
        }

        private async Task<Payment?> CreatePaymentAsync(CheckOutDto model)
        {
            var payment = new Payment
            {
                Date = DateOnly.FromDateTime(DateTime.UtcNow),
                Amount = model.OrderSummary.Total,
                PaymentMethodId = model.PaymentMethod,
                Status = 0,
                CreateDate = DateTime.UtcNow,
                CreatedBy = model.BillingName
            };

            return await paymentRepo.AddAsync(payment);
        }

        private async Task<Order?> CreateOrderAsync(string customerId, CheckOutDto model, int shippingId, int paymentId)
        {
            var order = new Order
            {
                CustomerId = customerId,
                ShippingId = shippingId,
                PaymentId = paymentId,
                StatusId = 1,
                OrderDate = DateOnly.FromDateTime(DateTime.UtcNow),
                Name = model.BillingName,
                Phone = model.BillingPhone,
                Email = model.Email,
                Address = model.BillingAddress,
                TotalCost = model.OrderSummary.SubTotal,
                CostDiscount = model.OrderSummary.DiscountAmount,
                ShippingCost = model.OrderSummary.ShippingFee,
                FinalCost = model.OrderSummary.Total,
                Note = model.Note,
            };

            if (model.ShippingName != null && model.ShippingPhone != null && model.ShippingAddress != null)
            {
                order.NameReceive = model.ShippingName;
                order.PhoneReceive = model.ShippingPhone;
                order.ShippingAddress = model.ShippingAddress;
            }

            return await orderRepo.AddAsync(order);
        }

        private async Task<List<OrderProduct>?> CreateOrderDetailAsync(Order order, Cart cart)
        {
            var orderDetails = cart.CartProducts.Select(cartProduct => new OrderProduct
            {
                OrderId = order.OrderId,
                ProductId = cartProduct.ProductId,
                Price = cartProduct.Product!.PriceAfterDiscount,
                Quantity = cartProduct.Quantity,
                CostAtPurchase = cartProduct.Product!.PriceAfterDiscount * cartProduct.Quantity,
            }).ToList();
            
            return await orderRepo.AddOrderDetailAsync(orderDetails);
        }

        private async Task<List<OrderProduct>?> CreateOrderDetailForBuyNowAsync(Order order, OrderSummary orderSummary)
        {
            var firstItem = orderSummary.Items.FirstOrDefault();
            if (firstItem == null || firstItem.ProductId == null) return null;

            var orderDetails = new List<OrderProduct>
            {
                new()
                {
                    OrderId = order.OrderId,
                    ProductId = firstItem.ProductId.Value,
                    Price = firstItem.Price ?? 0,
                    Quantity = firstItem.Quantity,
                    CostAtPurchase = (firstItem.Price ?? 0) * firstItem.Quantity
                }
            };

            return await orderRepo.AddOrderDetailAsync(orderDetails);
        }

        private void SendEmail(Order order)
        {
            if (order.Email != null)
            {
                backgroundTaskQueue.QueueBackgroundWorkItem(async token =>
                {
                    await emailService.SendEmailAsync(
                        order.Email,
                        "Your Order Confirmation from DTech",
                        $@"
                        <html>
                            <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
                                <div style='max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);'>
                                    <h2 style='color: #28a745;'>Thank you for your order!</h2>
                                    <p>Hello <strong>{order.Name ?? "Valued Customer"}</strong>,</p>
                                    <p>We're happy to let you know that we've received your order. Below is a summary of your purchase:</p>

                                    <h4 style='margin-top: 30px;'>Order #{order.OrderId}</h4>

                                    <table style='width: 100%; border-collapse: collapse; margin-top: 15px;'>
                                        <thead>
                                            <tr style='background-color: #f0f0f0;'>
                                                <th style='padding: 10px; text-align: left; border-bottom: 1px solid #ddd;'>Product</th>
                                                <th style='padding: 10px; text-align: center; border-bottom: 1px solid #ddd;'>Quantity</th>
                                                <th style='padding: 10px; text-align: right; border-bottom: 1px solid #ddd;'>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {string.Join("", order.OrderProducts.Select(product => $@"
                                                <tr>
                                                    <td style='padding: 10px; border-bottom: 1px solid #eee;'>{product.Product?.Name}</td>
                                                    <td style='padding: 10px; text-align: center; border-bottom: 1px solid #eee;'>{product.Quantity}</td>
                                                    <td style='padding: 10px; text-align: right; border-bottom: 1px solid #eee;'>{product.CostAtPurchase:N0} ₫</td>
                                                </tr>
                                            "))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colspan='2' style='padding: 10px; text-align: right;'>Subtotal:</td>
                                                <td style='padding: 10px; text-align: right;'>{order.TotalCost:N0} ₫</td>
                                            </tr>
                                            <tr>
                                                <td colspan='2' style='padding: 10px; text-align: right;'>Shipping:</td>
                                                <td style='padding: 10px; text-align: right;'>{order.ShippingCost:N0} ₫</td>
                                            </tr>
                                            {(order.CostDiscount > 0 ? $@"
                                                <tr>
                                                    <td colspan='2' style='padding: 10px; text-align: right;'>Discount:</td>
                                                    <td style='padding: 10px; text-align: right; color: red;'>- {order.CostDiscount:N0} ₫</td>
                                                </tr>
                                            " : "")}
                                            <tr style='font-weight: bold;'>
                                                <td colspan='2' style='padding: 10px; text-align: right;'>Total:</td>
                                                <td style='padding: 10px; text-align: right; color: #28a745;'>{order.FinalCost:N0} ₫</td>
                                            </tr>
                                        </tfoot>
                                    </table>

                                    <p style='margin-top: 30px;'>Your order will be shipped to:</p>
                                    <p style='background-color: #f8f9fa; padding: 10px; border-radius: 5px;'>
                                        {order.ShippingAddress ?? order.Address}<br/>
                                        Phone: {order.Phone}<br/>
                                        Email: {order.Email}
                                    </p>

                                    <p>If you have any questions or concerns, feel free to contact our support team.</p>

                                    <p>You can view your bill here: 
                                        <a href='#' style='color: #4CAF50; text-decoration: none;'>
                                            View Bill
                                        </a>
                                    </p>

                                    <p>Thank you for shopping with us!<br/><strong>DTech Team</strong></p>
                                </div>
                            </body>
                        </html>"
                    );
                });
            }
        }
    }
}
