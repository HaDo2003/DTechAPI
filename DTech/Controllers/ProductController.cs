using DTech.Application.DTOs.response;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        [HttpGet("{categorySlug}/{brandSlug}")]
        public async Task<ActionResult<CategoryPageDto>> GetProductsByCategoryAndBrandAsync(string categorySlug, string brandSlug, [FromQuery] string? sortOrder)
        {
            var products = await productService.GetProductsByCategoryAndBrandAsync(categorySlug, brandSlug, sortOrder);
            if (products == null || products.Count == 0)
            {
                return NotFound();
            }

            var formattedTitle = System.Globalization.CultureInfo.CurrentCulture.TextInfo
                .ToTitleCase(categorySlug.Replace("-", " "));
            var result = new CategoryPageDto
            {
                Title = formattedTitle,
                Products = products,
                Brands = null,
                InitialSort = sortOrder ?? "default",
                CategorySlug = categorySlug,
                //BrandSlug = brandSlug
            };
            return Ok(result);
        }

        [HttpGet("recentlyView")]
        public async Task<ActionResult> GetProductsByIds([FromQuery] string? ids)
        {
            var products = await productService.GetRecentlyViewedProductsAsync(ids);
            return Ok(products);
        }
    }
}
