using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DTech.Application.DTOs.Response.Admin
{
    public class GlbReq
    {
        [FromForm(Name = "file")]
        public IFormFile File { get; set; } = null!;
    }
}
