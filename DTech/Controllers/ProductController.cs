using DTech.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DTech.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController(
        IProductService productService) : ControllerBase
    {
        [HttpGet("{categorySlug}/{brandSlug}/{slug}")]
        public async Task<IActionResult> GetProductDetailAsync(string categorySlug, string brandSlug, string slug)
        {
            var product = await productService.ProductDetailAsync(categorySlug, brandSlug, slug);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }
    }
}
