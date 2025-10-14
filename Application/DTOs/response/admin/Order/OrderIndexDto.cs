namespace DTech.Application.DTOs.Response.Admin.Order
{
    public class OrderIndexDto
    {
        public string? Id { get; set; }
        public string? BillingName { get; set; }
        public DateTime? OrderDate { get; set; }
        public decimal? FinalCost { get; set; }
        public string? Status { get; set; }
    }
}
