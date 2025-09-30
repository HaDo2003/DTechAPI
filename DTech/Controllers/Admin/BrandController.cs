using DTech.API.Helper;
using DTech.Application.DTOs.Response.Admin.Brand;
using DTech.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DTech.API.Controllers.Admin
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin, Seller")]
    public class BrandController(
        IBrandService brandService
    ) : ControllerBase
    {
        [HttpGet("get-brands")]
        public async Task<IActionResult> GetBrands()
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await brandService.GetBrands();
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetBrand(int id)
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await brandService.GetBrandDetailAsync(id);
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateBrand([FromForm] BrandDetailDto model)
        {
            var (userId, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await brandService.CreateBrandAsync(model, userId);
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateBrand(int id, [FromForm] BrandDetailDto model)
        {
            var (userId, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await brandService.UpdateBrandAsync(id, model, userId);
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteBrand(int id)
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await brandService.DeleteBrandAsync(id);
            return ControllerHelper.HandleResponse(response, this);
        }
    }
}
