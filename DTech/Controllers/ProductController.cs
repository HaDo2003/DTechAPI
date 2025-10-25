using DTech.Application.DTOs.request;
using DTech.Application.DTOs.response;
using DTech.Application.Interfaces;
using DTech.Application.Services;
using DTech.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DTech.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController(
        IProductService productService
    ) : ControllerBase
    {
        [HttpGet("{categorySlug}/{brandSlug}/{slug}")]
        public async Task<IActionResult> GetProductDetail(string categorySlug, string brandSlug, string slug)
        {
            var product = await productService.ProductDetailAsync(categorySlug, brandSlug, slug);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        [HttpGet("{categorySlug}")]
        public async Task<ActionResult<CategoryPageDto>> GetProductsByCategory(string categorySlug,[FromQuery] string? sortOrder)
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
        public async Task<ActionResult<CategoryPageDto>> GetProductsByCategoryAndBrand(string categorySlug, string brandSlug, [FromQuery] string? sortOrder)
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
            };
            return Ok(result);
        }

        [HttpGet("all-products")]
        public async Task<IActionResult> GetAllProducts([FromQuery] int page = 1, [FromQuery] int pageSize = 15, [FromQuery] string? sortOrder = "newest")
        {
            var products = await productService.GetAllProductsAsync(page, pageSize, sortOrder);
            if (products == null || products.Products.Count == 0)
            {
                return NotFound();
            }

            return Ok(new
            {
                title = "All Products",
                products = products.Products,
                brands = products.Brands,
                totalPages = products.TotalPages,
                totalItems = products.TotalItems
            });
        }

        [HttpGet("recentlyView")]
        public async Task<ActionResult> GetProductsByIds([FromQuery] string? ids)
        {
            var products = await productService.GetRecentlyViewedProductsAsync(ids);
            return Ok(products);
        }

        [HttpPost("post-comment")]
        public async Task<IActionResult> PostComment([FromBody] ProductCommentRequestDto model)
        {
            var response = await productService.PostCommentAsync(model);
            if(!response.Success)
                return BadRequest(new { response.Message });
            return Ok(response);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query, [FromQuery] string sortOrder = "newest")
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest(new { message = "Query cannot be empty." });

            var products = await productService.SearchProductsAsync(query, sortOrder, userId);

            return Ok(new { products, initialSort = sortOrder, success = true });
        }
    }
}
