using DTech.Application.DTOs.response.admin;
using DTech.Application.DTOs.Response.Admin.PaymentMethod;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;

namespace DTech.Application.Services
{
    public class PaymentMethodService(
        IAdminRepository adminRepo,
        IPaymentMethodRepository paymentRepo
    ) : IPaymentMethodService
    {
        public async Task<IndexResDto<List<PaymentMethodIndexDto>>> GetPaymentMethodsAsync()
        {
            var methods = await paymentRepo.GetAllPaymentMethodsAsync();
            if (methods == null || methods.Count == 0)
            {
                return new IndexResDto<List<PaymentMethodIndexDto>>
                {
                    Success = false,
                    Message = "No payment methods found"
                };
            }

            var methodDtos = methods.Select(pm => new PaymentMethodIndexDto
            {
                Id = pm.PaymentMethodId,
                Description = pm.Description,
            }).ToList();

            return new IndexResDto<List<PaymentMethodIndexDto>>
            {
                Success = true,
                Data = methodDtos
            };
        }

        public async Task<IndexResDto<PaymentMethodDetailDto>> GetPaymentMethodDetailAsync(int paymentMethodId)
        {
            var method = await paymentRepo.GetPaymentMethodByIdAsync(paymentMethodId);
            if (method == null)
            {
                return new IndexResDto<PaymentMethodDetailDto>
                {
                    Success = false,
                    Message = "Payment method not found"
                };
            }

            var methodDetail = new PaymentMethodDetailDto
            {
                Id = method.PaymentMethodId,
                Description = method.Description,
                CreateDate = method.CreateDate,
                CreatedBy = method.CreatedBy,
                UpdateDate = method.UpdateDate,
                UpdatedBy = method.UpdatedBy
            };

            return new IndexResDto<PaymentMethodDetailDto>
            {
                Success = true,
                Data = methodDetail
            };
        }

        public async Task<IndexResDto<object?>> CreatePaymentMethodAsync(PaymentMethodDetailDto model, string? currentUserId)
        {
            try
            {
                PaymentMethod method = new()
                {
                    Description = model.Description,
                    CreateDate = DateTime.UtcNow,
                    CreatedBy = await adminRepo.GetAdminFullNameAsync(currentUserId),
                };

                var existingMethod = await paymentRepo.CheckIfPaymentMethodExistsAsync(method);
                if (existingMethod)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = "Payment method with same name exists",
                        Data = null
                    };
                }

                var (Success, Message) = await paymentRepo.CreatePaymentMethodAsync(method);

                if (!Success)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = Message,
                        Data = null
                    };
                }

                return new IndexResDto<object?>
                {
                    Success = true,
                    Message = "Payment method created successfully",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new IndexResDto<object?>
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<IndexResDto<object?>> UpdatePaymentMethodAsync(int paymentMethodId, PaymentMethodDetailDto model, string? currentUserId)
        {
            try
            {
                PaymentMethod method = new()
                {
                    PaymentMethodId = paymentMethodId,
                    Description = model.Description,
                    UpdateDate = DateTime.UtcNow,
                    UpdatedBy = await adminRepo.GetAdminFullNameAsync(currentUserId),
                };

                var existingMethod = await paymentRepo.CheckIfPaymentMethodExistsAsync(method);
                if (existingMethod)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = "Payment method with the same name already exists",
                        Data = null
                    };
                }

                var (Success, Message) = await paymentRepo.UpdatePaymentMethodAsync(method);
                if (!Success)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = Message,
                        Data = null
                    };
                }

                return new IndexResDto<object?>
                {
                    Success = true,
                    Message = "Payment method updated successfully",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new IndexResDto<object?>
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<IndexResDto<object?>> DeletePaymentMethodAsync(int paymentMethodId)
        {
            try
            {
                var (Success, Message) = await paymentRepo.DeletePaymentMethodAsync(paymentMethodId);
                if (!Success)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = Message,
                        Data = null
                    };
                }

                return new IndexResDto<object?>
                {
                    Success = true,
                    Message = "Payment method deleted successfully",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new IndexResDto<object?>
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}",
                    Data = null
                };
            }
        }
    }
}
