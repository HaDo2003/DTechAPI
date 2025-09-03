namespace DTech.Application.DTOs.response
{
    public class OrderDto
    {
        public string? OrderId { get; set; }
        public DateOnly? OrderDate { get; set; }
        public decimal? FinalCost { get; set; }
        public string? StatusName { get; set; }
    }
}
