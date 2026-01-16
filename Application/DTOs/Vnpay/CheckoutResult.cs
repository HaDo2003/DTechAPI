using DTech.Domain.Enums;

namespace DTech.Application.DTOs.Vnpay
{
    public class CheckoutResult
    {
        public int OrderId { get; init; }
        public PaymentMethodEnums? PaymentMethod { get; init; }
        public string? PaymentUrl { get; init; }

        public static CheckoutResult VNPay(int orderId, string url)
            => new()
            {
                OrderId = orderId,
                PaymentMethod = PaymentMethodEnums.VNPay,
                PaymentUrl = url
            };

        public static CheckoutResult Cod(int orderId)
            => new()
            {
                OrderId = orderId,
                PaymentMethod = PaymentMethodEnums.COD
            };
    }
}
