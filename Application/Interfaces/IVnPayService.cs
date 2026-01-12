using DTech.Application.DTOs.Vnpay;
using Microsoft.AspNetCore.Http;

namespace DTech.Application.Interfaces
{
    public interface IVnPayService
    {
        string CreateVnPayPaymentUrl(long amount, string description);

    }
}
