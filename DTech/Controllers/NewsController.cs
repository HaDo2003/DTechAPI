using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace DTech.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NewsController(INewsService newsService) : ControllerBase
    {
        [HttpGet("get-all-categories")]
        public async Task<IActionResult> GetAllCategory()
        {
            var categories = await newsService.GetAllPostCategoryAsync();
            if (categories == null)
            {
                return NotFound();
            }
            return Ok(categories);
        }

        [HttpGet("get-initial-page")]
        public async Task<IActionResult> GetInitialPageData()
        {
            var initialPageData = await newsService.GetInitialPageDataAsync();
            if (initialPageData == null)
            {
                return NotFound();
            }
            return Ok(initialPageData);
        }

        [HttpGet("get-posts-by-category/{categorySlug}")]
        public async Task<IActionResult> GetPostsByCategory(
            string categorySlug,
            [FromQuery] int page = 1, 
            [FromQuery] int pageSize = 6
        )
        {
            var result = await newsService.GetPostsByCategoryAsync(categorySlug, page, pageSize);
            if (result == null) {
                return NotFound();
            }
            return Ok( new 
            { 
                title = result.Title,
                posts = result.Posts,
                totalPages = result.TotalPages,
                totalItems = result.TotalItems
            });
        }
    } 
}
