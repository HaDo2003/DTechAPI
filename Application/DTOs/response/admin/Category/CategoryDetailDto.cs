using DTech.Domain.Enums;

namespace DTech.Application.DTOs.Response.Admin.Category
{
    public class CategoryDetailDto
    {
        public string? Name { get; set; }
        public string? Slug { get; set; }
        public int? ParentId { get; set; }
        public string? ParentName { get; set; }
        public StatusEnums Status { get; set; } = StatusEnums.Available;
        public DateTime? CreateDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
