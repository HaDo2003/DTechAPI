using DTech.Application.DTOs;
using DTech.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

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

        [HttpGet("{categorySlug}")]
        public async Task<ActionResult<CategoryPageDto>> GetProductsByCategoryAsync(string categorySlug,[FromQuery] string? sortOrder)
        {
            var products = await productService.GetProductsByCategoryAsync(categorySlug, sortOrder);
            if (products == null || products.Count == 0)
            {
                return NotFound();
            }

            var brands = products
                .Where(p => p.Brand != null)
                .Select(p => p.Brand)
                .DistinctBy(b => b!.BrandId)
                .ToList();

            var formattedTitle = System.Globalization.CultureInfo.CurrentCulture.TextInfo
                .ToTitleCase(categorySlug.Replace("-", " "));

            var result = new CategoryPageDto
            {
                Title = formattedTitle,
                Products = products,
                Brands = brands,
                InitialSort = sortOrder ?? "default",
                CategorySlug = categorySlug
            };
            return Ok(result);
        }
    }
}
