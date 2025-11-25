using AutoMapper;
using DTech.Application.DTOs.request;
using DTech.Application.DTOs.response;
using DTech.Application.DTOs.Response.Admin;
using DTech.Application.DTOs.Response.Admin.Customer;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;

namespace DTech.Application.Services
{
    public class CustomerService(
        ICustomerRepository customerRepo,
        IOrderRepository orderRepo,
        IProductRepository productRepo,
        IMapper mapper,
        ICloudinaryService cloudinaryService,
        IBackgroundTaskQueue backgroundTaskQueue,
        IEmailService emailService,
        IUnitOfWorkService unitOfWorkService
    ) : ICustomerService
    {
        readonly string folderName = "Pre-thesis/Customer";
        public async Task<CustomerDto> GetCustomer(string customerId)
        {
            var customer = await customerRepo.GetCustomerByIdAsync(customerId);
            if (customer == null)
                return new CustomerDto { Success = false, Message = "Customer not found" };

            var customerDto = mapper.Map<CustomerDto>(customer);
            return customerDto;
        }

        public async Task<MessageResponse> UpdateCustomerProfile(string customerId, UpdateProfileDto model)
        {
            var customer = await customerRepo.GetCustomerByIdAsync(customerId);
            if (customer == null)
                return new MessageResponse { Success = false, Message = "Customer not found" };

            // Check email existed
            var existingEmail = await customerRepo.CheckEmailAsync(model.Email, customer.Id);
            if (existingEmail)
                return new MessageResponse { Success = false, Message = "Email already exists." };


            // Check phone existed
            var existingPhone = await customerRepo.CheckPhoneAsync(model.PhoneNumber, customer.Id);
            if (existingPhone)
                return new MessageResponse { Success = false, Message = "Phone number already exists." };


            // Handle image change
            if (model.ImageUpload != null && model.ImageUpload.Length > 0)
            {
                string imageName = await cloudinaryService.ChangeImageAsync(
                    oldfile: customer.Image ?? string.Empty,
                    newfile: model.ImageUpload,
                    filepath: folderName
                );

                if (string.IsNullOrEmpty(imageName))
                {
                    return new MessageResponse { Success = false, Message = "Image upload failed" };
                }

                model.Image = imageName;
            }

            var newProfile = mapper.Map<ApplicationUser>(model);
            newProfile.Id = customerId;

            var isUpdated = await customerRepo.UpdateCustomerAsync(newProfile);
            if (!isUpdated)
                return new MessageResponse { Success = false, Message = "Failed to update profile" };

            return new MessageResponse { Success = true, Message = "Profile updated successfully" };
        }

        public async Task<MessageResponse> UpdateNewPasswordAsync(string customerId, ChangePasswordDto model)
        {
            var customer = await customerRepo.GetCustomerByIdAsync(customerId);
            if (customer == null)
                return new MessageResponse { Success = false, Message = "Customer not found" };

            var isUpdated = await customerRepo.UpdateCustomerPasswordAsync(customer, model.OldPassword, model.NewPassword);
            if (!isUpdated)
                return new MessageResponse { Success = false, Message = "Failed to change password" };

            return new MessageResponse { Success = true, Message = "Change Password successfully" };
        }

        public async Task<AddressResponse> AddAddressAsync(string customerId, AddAddressDto model)
        {
            var customer = await customerRepo.CheckCustomerAsync(customerId);
            if (!customer)
                return new AddressResponse { Success = false, Message = "Customer not found" };

            var customerAddress = mapper.Map<CustomerAddress>(model);
            customerAddress.CustomerId = customerId;
            var addressId = await customerRepo.AddAddressAsync(customerAddress);
            if (addressId == null)
                return new AddressResponse { Success = false, Message = "Failed to add new address" };

            return new AddressResponse
            {
                Success = true,
                Message = "Add new address successfully",
                AddressId = addressId
            };
        }

        public async Task<MessageResponse> EditAddressAsync(string customerId, EditAddressDto model)
        {
            var customer = await customerRepo.CheckCustomerAsync(customerId);
            if (!customer)
                return new MessageResponse { Success = false, Message = "Customer not found" };

            var customerAddress = mapper.Map<CustomerAddress>(model);
            customerAddress.CustomerId = customerId;
            var isUpdated = await customerRepo.EditAddressAsync(customerAddress);
            if (!isUpdated)
                return new MessageResponse { Success = false, Message = "Failed to edit address" };

            return new MessageResponse { Success = true, Message = "Edit address successfully" };
        }

        public async Task<MessageResponse> DeleteAddressAsync(string customerId, int addressId)
        {
            var isUpdated = await customerRepo.DeleteAddressAsync(customerId, addressId);
            if (!isUpdated)
                return new MessageResponse { Success = false, Message = "Failed to delete address" };

            return new MessageResponse { Success = true, Message = "Delete address successfully" };
        }
        public async Task<MessageResponse> SendContactAsync(ContactDto model)
        {
            var contact = mapper.Map<Feedback>(model);
            var res = await customerRepo.SendContactAsync(contact);
            if (!res)
            {
                return new MessageResponse { Success = false, Message = "Send Contact Fail" };
            }

            if (!string.IsNullOrEmpty(model.Email))
            {
                backgroundTaskQueue.QueueBackgroundWorkItem(async token =>
                {
                    string subject = "Thank you for contacting DTech!";
                    string body = $@"
                        <html>
                            <body style='font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;'>
                                <div style='max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);'>
                                    <h2 style='color: #007bff;'>Hi {model.Name},</h2>
                                    <p>Thank you for reaching out to <strong>DTech</strong>!</p>
                                    <p>We've received your message and will get back to you as soon as possible.</p>
                                    <p style='margin-top: 20px;'>Best regards,<br/>The DTech Team</p>
                                </div>
                            </body>
                        </html>";
                    await emailService.SendEmailAsync(model.Email, subject, body);
                });
            }
            return new MessageResponse { Success = true, Message = "Send Contact Successfully" };
        }

        public async Task<AddressResponse> SwitchDefaultAsync(string customerId, int addressId)
        {
            var customer = await customerRepo.CheckCustomerAsync(customerId);
            if (!customer)
                return new AddressResponse { Success = false, Message = "Customer not found" };

            var isUpdated = await customerRepo.SetDefaultAddressAsync(customerId, addressId);
            if (!isUpdated)
                return new AddressResponse { Success = false, Message = "Failed to change default address" };

            return new AddressResponse
            {
                Success = true,
                Message = "Edit address successfully",
                AddressId = addressId
            };
        }

        public async Task<OrderDetailResDto> GetOrderDetailAsync(string customerId, string orderId)
        {
            var customer = await customerRepo.CheckCustomerAsync(customerId);
            if (!customer)
                return new OrderDetailResDto { Success = false, Message = "Customer not found" };

            var order = await orderRepo.GetOrderDetailAsync(customerId, orderId);
            if (order == null)
                return new OrderDetailResDto { Success = false, Message = "Order not found" };

            OrderDetailResDto model = new()
            {
                OrderId = order.OrderId,
                OrderDate = order.OrderDate,
                Name = order.Name,
                NameReceive = order.NameReceive,
                ShippingAddress = order.ShippingAddress,
                Address = order.Address,
                StatusName = order.Status?.Description ?? "Unknown",
                Note = order.Note,
                CostDiscount = order.CostDiscount,
                ShippingCost = order.ShippingCost,
                FinalCost = order.FinalCost,
                Payment = order.Payment == null
                    ? null
                    : new PaymentDto
                    {
                        Status = order.Payment.Status,
                        PaymentMethodName = order.Payment.PaymentMethod!.Description ?? string.Empty,
                    },
                OrderProducts = order.OrderProducts?.Select(op => new OrderProductDto
                {
                    Id = op.Id,
                    Name = op.Product.Name,
                    Photo = op.Product.Photo,
                    Price = op.Price,
                    Quantity = op.Quantity,
                    CostAtPurchase = op.CostAtPurchase,
                }).ToList()
            };

            return model;
        }

        public async Task<OrderDetailResDto> CancelOrderAsync(string customerId, string orderId)
        {
            var customer = await customerRepo.CheckCustomerAsync(customerId);
            if (!customer)
                return new OrderDetailResDto { Success = false, Message = "Customer not found" };

            await unitOfWorkService.BeginTransactionAsync();

            try
            {
                // 1. Update status to Cancelled
                int orderStatusId = 7;
                var orderUpdated = await orderRepo.UpdateStatusAsync(orderId, customerId, orderStatusId);
                if (orderUpdated == null)
                {
                    await unitOfWorkService.RollbackTransactionAsync();
                    return new OrderDetailResDto { Success = false, Message = "Fail to cancel order" };
                }

                // 2. Restore stock for each product
                foreach (var op in orderUpdated.OrderProducts)
                {
                    Console.WriteLine($"[DEBUG REBACK] Restore stock for Product: {op.ProductId}, quantity: {op.Quantity}");
                    bool restored = await productRepo.IncreaseStockAsync(op.ProductId, op.Quantity);
                    if (!restored)
                    {
                        await unitOfWorkService.RollbackTransactionAsync();
                        return new OrderDetailResDto
                        {
                            Success = false,
                            Message = $"Failed to restore stock for Product {op.ProductId}"
                        };
                    }
                }

                await unitOfWorkService.CommitTransactionAsync();

                // 3. Return updated response
                return new OrderDetailResDto
                {
                    Success = true,
                    OrderId = orderUpdated.OrderId,
                    OrderDate = orderUpdated.OrderDate,
                    Name = orderUpdated.Name,
                    NameReceive = orderUpdated.NameReceive,
                    ShippingAddress = orderUpdated.ShippingAddress,
                    Address = orderUpdated.Address,
                    StatusName = orderUpdated.Status?.Description ?? "Unknown",
                    Note = orderUpdated.Note,
                    CostDiscount = orderUpdated.CostDiscount,
                    ShippingCost = orderUpdated.ShippingCost,
                    FinalCost = orderUpdated.FinalCost,
                    Payment = orderUpdated.Payment == null
                        ? null
                        : new PaymentDto
                        {
                            Status = orderUpdated.Payment.Status,
                            PaymentMethodName = orderUpdated.Payment.PaymentMethod!.Description ?? string.Empty,
                        },
                    OrderProducts = orderUpdated.OrderProducts.Select(op => new OrderProductDto
                    {
                        Id = op.Id,
                        Name = op.Product.Name,
                        Photo = op.Product.Photo,
                        Price = op.Product.Price,
                        Quantity = op.Quantity,
                        CostAtPurchase = op.CostAtPurchase,
                    }).ToList()
                };
            }
            catch (Exception ex)
            {
                await unitOfWorkService.RollbackTransactionAsync();
                return new OrderDetailResDto
                {
                    Success = false,
                    Message = "Error: " + ex.Message
                };
            }
        }

        public async Task<MessageResponse> AddProductToWishlistAsync(string customerId, int productId)
        {
            var customer = await customerRepo.CheckCustomerAsync(customerId);
            if (!customer)
                return new MessageResponse { Success = false, Message = "Customer not found" };

            var result = await customerRepo.AddProductToWishlistAsync(customerId, productId);
            if (!result)
                return new MessageResponse { Success = false, Message = "Failed to add product to wishlist" };

            return new MessageResponse { Success = true, Message = "Add product to wishlist successfully" };
        }

        public async Task<IndexResDto<List<WishlistDto>>> GetWishlistAsync(string customerId)
        {
            var customer = await customerRepo.CheckCustomerAsync(customerId);
            if (!customer)
                return new IndexResDto<List<WishlistDto>> {
                    Success = false,
                    Message = "Customer not found"
                };

            var wls = await customerRepo.GetAllWishlistByCustomerIdAync(customerId);

            var wishListDtos = new List<WishlistDto>();
            foreach (var wishlist in wls)
            {
                var product = await productRepo.GetProductByIdAsync(wishlist.ProductId);
                wishListDtos.Add(new WishlistDto
                {
                    WishListId = wishlist.WishListId,
                    ProductId = wishlist.ProductId,
                    Product = product != null ? mapper.Map<ProductDto>(product) : null
                });
            }

            return new IndexResDto<List<WishlistDto>>
            {
                Success = true,
                Data = [.. wishListDtos]
            };
        }

        public async Task<MessageResponse> RemoveProductFromWishlistAsync(string customerId, int productId)
        {
            var customer = await customerRepo.CheckCustomerAsync(customerId);
            if (!customer)
                return new MessageResponse { Success = false, Message = "Customer not found" };

            var isWishlist = await customerRepo.CheckWishlistAsync(customerId, productId);
            if (!isWishlist)
                return new MessageResponse { Success = false, Message = "Failed to remove product from wishlist" };

            var result = await customerRepo.RemoveProductFromWishlistAsync(customerId, productId);
            if (!result)
                return new MessageResponse { Success = false, Message = "Failed to remove product from wishlist" };

            return new MessageResponse { Success = true, Message = "Remove product from wishlist successfully" };
        }

        // For Admin
        public async Task<IndexResDto<List<CustomerIndexDto>>> GetCustomersAsync()
        {
            var customers = await customerRepo.GetAllCustomersAsync();
            if (customers == null || customers.Count == 0)
            {
                return new IndexResDto<List<CustomerIndexDto>>
                {
                    Success = false,
                    Message = "No advertisement found"
                };
            }

            var customerDtos = customers.Select(customer => new CustomerIndexDto
            {
                Id = customer.Id,
                UserName = customer.UserName,
                FullName = customer.FullName,
                Email = customer.Email,
                PhoneNumber = customer.PhoneNumber,
            }).ToList();

            return new IndexResDto<List<CustomerIndexDto>>
            {
                Success = true,
                Data = customerDtos
            };
        }
        public async Task<IndexResDto<CustomerDetailDto>> GetCustomerDetailAsync(string customerId)
        {
            var customer = await customerRepo.GetOnlyCustomerByIdAsync(customerId);
            if (customer == null)
            {
                return new IndexResDto<CustomerDetailDto>
                {
                    Success = false,
                    Message = "Advertisement not found"
                };
            }
            var customerDetail = new CustomerDetailDto
            {
                UserName = customer.UserName,
                FullName = customer.FullName,
                Email = customer.Email,
                PhoneNumber = customer.PhoneNumber,
                Gender = customer.Gender,
                DateOfBirth = customer.DateOfBirth,
                CreateDate = customer.CreateDate,
                CreatedBy = customer.CreatedBy,
                UpdateDate = customer.UpdateDate,
                UpdatedBy = customer.UpdatedBy,
            };

            return new IndexResDto<CustomerDetailDto>
            {
                Success = true,
                Data = customerDetail
            };
        }

    }
}
