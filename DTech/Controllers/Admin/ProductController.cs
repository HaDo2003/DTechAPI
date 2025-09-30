using DTech.API.Helper;
using DTech.Application.DTOs.Response.Admin.Product;
using DTech.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DTech.API.Controllers.Admin
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin, Seller")]
    public class ProductController(
        IProductService productService
    ) : ControllerBase
    {
        [HttpGet("get-products")]
        public async Task<IActionResult> GetProducts()
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await productService.GetProductsAsync();
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await productService.GetProductDetailAsync(id);
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateProduct([FromForm] ProductDetailDto model)
        {
            var (userId, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await productService.CreateProductAsync(model, userId);
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductDetailDto model)
        {
            var (userId, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await productService.UpdateProductAsync(id, model, userId);
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await productService.DeleteProductAsync(id);
            return ControllerHelper.HandleResponse(response, this);
        }
    }

}
