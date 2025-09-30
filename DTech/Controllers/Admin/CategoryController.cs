using DTech.API.Helper;
using DTech.Application.DTOs.Response.Admin.Category;
using DTech.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DTech.API.Controllers.Admin
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin, Seller")]
    public class CategoryController(
        ICategoryService categoryService
    ) : ControllerBase
    {
        [HttpGet("get-categories")]
        public async Task<IActionResult> GetCategories()
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await categoryService.GetCategoriesAsync();
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetCategory(int id)
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await categoryService.GetCategoryDetailAsync(id);
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateCategory([FromForm] CategoryDetailDto model)
        {
            var (userId, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await categoryService.CreateCategoryAsync(model, userId);
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromForm] CategoryDetailDto model)
        {
            var (userId, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await categoryService.UpdateCategoryAsync(id, model, userId);
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await categoryService.DeleteCategoryAsync(id);
            return ControllerHelper.HandleResponse(response, this);
        }
    }
}
