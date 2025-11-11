using DTech.Domain.Enums;

namespace DTech.Application.DTOs.Response.Admin.Dashboard
{
    public class DashboardResDto
    {
        public List<OrderMonitoring>? LatestOrders { get; set; }
        public List<UserMonitoring>? UsersList { get; set; }
        public List<ProductMonitoring>? ProductsList { get; set; }
        public List<VisitorCountMonitoring>? VisitorCounts { get; set; }
    }

    public class OrderMonitoring
    {
        public string? OrderId { get; set; }
        public string? CustomerName { get; set; }
        public string? Status { get; set; }
        public int Quantity { get; set; }
    }

    public class UserMonitoring
    {
        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public string? Image { get; set; }
        public DateTime? CreatedAt { get; set; }
    }

    public class ProductMonitoring
    {
        public int? ProductId { get; set; }
        public string? ProductName { get; set; }
        public string? Photo { get; set; }
        public decimal? Price { get; set; }
        public string? Category { get; set; }
    }

    public class VisitorCountMonitoring
    {
        public int Week { get; set; }
        public DateOnly Date { get; set; }
        public DayOfWeekEnums Day { get; set; }
        public int Count { get; set; }
    }
}
