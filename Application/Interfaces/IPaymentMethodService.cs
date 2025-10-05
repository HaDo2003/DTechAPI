using DTech.Application.DTOs.Response.Admin;
using DTech.Application.DTOs.Response.Admin.PaymentMethod;

namespace DTech.Application.Interfaces
{
    public interface IPaymentMethodService
    {
        Task<IndexResDto<List<PaymentMethodIndexDto>>> GetPaymentMethodsAsync();
        Task<IndexResDto<PaymentMethodDetailDto>> GetPaymentMethodDetailAsync(int paymentMethodId);
        Task<IndexResDto<object?>> CreatePaymentMethodAsync(PaymentMethodDetailDto model, string? currentUserId);
        Task<IndexResDto<object?>> UpdatePaymentMethodAsync(int paymentMethodId, PaymentMethodDetailDto model, string? currentUserId);
        Task<IndexResDto<object?>> DeletePaymentMethodAsync(int paymentMethodId);
    }
}
