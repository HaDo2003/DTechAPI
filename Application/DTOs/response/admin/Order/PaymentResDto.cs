using DTech.Domain.Enums;

namespace DTech.Application.DTOs.Response.Admin.Order
{
    public class PaymentResDto
    {
        public string? Method { get; set; }
        public PaymentStatusEnums Status { get; set; }
    }
}
