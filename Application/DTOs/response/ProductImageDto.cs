using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTech.Application.DTOs.response
{
    public class ProductImageDto
    {
        public int ImageId { get; set; }
        public string? Image { get; set; }
        public IFormFile? ImageUpload { get; set; }
    }
}
