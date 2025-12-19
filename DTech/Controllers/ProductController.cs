using DTech.Application.DTOs.request;
using DTech.Application.DTOs.Request;
using DTech.Application.DTOs.response;
using DTech.Application.DTOs.Response;
using DTech.Application.Interfaces;
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
        public async Task<IActionResult> GetProductsByCategory(
            string categorySlug,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 15,
            [FromQuery] string? sortOrder = null
        )
        {
            var products = await productService.GetProductsByCategoryAsync(categorySlug, page, pageSize, sortOrder);
            if (products == null || products.Products.Count == 0)
            {
                return NotFound();
            }

            var brands = products.Products
                .Where(p => p.Brand != null)
                .Select(p => p.Brand)
                .DistinctBy(b => b!.BrandId)
                .ToList();

            var formattedTitle = System.Globalization.CultureInfo.CurrentCulture.TextInfo
                .ToTitleCase(categorySlug.Replace("-", " "));

            var result = new PaginatedProductResDto
            {
                Title = formattedTitle,
                Products = products.Products,
                Brands = brands,
                InitialSort = sortOrder ?? "default",
                CategorySlug = categorySlug,
                TotalPages = products.TotalPages,
                TotalItems = products.TotalItems
            };
            return Ok(result);
        }

        [HttpGet("{categorySlug}/{brandSlug}")]
        public async Task<IActionResult> GetProductsByCategoryAndBrand(
            string categorySlug,
            string brandSlug,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 15,
            [FromQuery] string? sortOrder = null
        ){
            var products = await productService.GetProductsByCategoryAndBrandAsync(categorySlug, brandSlug, page, pageSize, sortOrder);
            if (products == null || products.Products.Count == 0)
            {
                return NotFound();
            }

            var formattedTitle = System.Globalization.CultureInfo.CurrentCulture.TextInfo
                .ToTitleCase(categorySlug.Replace("-", " "));
            var result = new PaginatedProductResDto
            {
                Title = formattedTitle,
                Products = products.Products,
                Brands = null,
                InitialSort = sortOrder ?? "default",
                CategorySlug = categorySlug,
                TotalPages = products.TotalPages,
                TotalItems = products.TotalItems
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
        public async Task<IActionResult> Search(
            [FromQuery] string query,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 15,
            [FromQuery] string sortOrder = "newest"
        )
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest(new { message = "Query cannot be empty." });

            var result = await productService.SearchProductsAsync(query, page, pageSize, sortOrder, userId);

            if (result == null)
                return NotFound(new { message = "No products found.", success = false });

            return Ok(new { products = result.Products, initialSort = sortOrder, success = true });
        }

        [HttpPost("{categorySlug}/filter")]
        public async Task<IActionResult> GetFilteredProducts(
            string categorySlug,
            [FromBody] FilterReqDto filterRequest,
            [FromQuery] string? brandSlug = null
        )
        {
            var result = await productService.GetFilteredProductsAsync(categorySlug, filterRequest, brandSlug);
            if (result == null || result.Products.Count == 0)
            {
                return NotFound();
            }

            var formattedTitle = System.Globalization.CultureInfo.CurrentCulture.TextInfo
                .ToTitleCase(categorySlug.Replace("-", " "));

            var response = new PaginatedProductResDto
            {
                Title = formattedTitle,
                Products = result.Products,
                Brands = result.Brands,
                InitialSort = filterRequest.SortOrder,
                CategorySlug = categorySlug,
                TotalPages = result.TotalPages,
                TotalItems = result.TotalItems
            };

            return Ok(response);
        }
    }
}
