namespace DTech.Application.DTOs.Response.Admin.PaymentMethod
{
    public class PaymentMethodDetailDto
    {
        public int? Id { get; set; }
        public string? Description { get; set; }
        public DateTime? CreateDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
