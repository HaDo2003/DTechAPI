using DTech.Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace DTech.Application.DTOs.Response.Admin.Brand
{
    public class BrandDetailDto
    {
        public string? Name { get; set; }
        public string? Slug { get; set; }
        public StatusEnums Status { get; set; } = StatusEnums.Available;
        public string? Image { get; set; }
        public IFormFile? ImageUpload { get; set; }
        public DateTime? CreateDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? UpdateDate { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
