using DTech.Application.DTOs.Vnpay;
using Microsoft.AspNetCore.Http;

namespace DTech.Application.Interfaces
{
    public interface IVnPayService
    {
        string CreatePaymentUrl(PaymentInformationModel model, string? clientIp);
        PaymentResponseModel PaymentExecute(IQueryCollection collections);

    }
}
