using DTech.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using VNPAY;
using VNPAY.Models.Enums;

public class VnPayService(IVnpayClient _vnpayClient) : IVnPayService
{
    public string CreateVnPayPaymentUrl(long amount, string description)
    {
        var paymentUrlInfo = _vnpayClient.CreatePaymentUrl(
            amount,
            description,
            BankCode.ANY
        );

        return paymentUrlInfo.Url;
    }
}
