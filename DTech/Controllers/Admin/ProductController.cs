using DTech.API.Helper;
using DTech.Application.DTOs.response;
using DTech.Application.DTOs.Response;
using DTech.Application.DTOs.Response.Admin;
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
            if (response == null)
            {
                return NotFound(new
                {
                    Success = false,
                    Message = "Product not found"
                });
            }

            return Ok(response);
        }

        [HttpGet("get-categories")]
        public async Task<IActionResult> GetCategories()
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var categories = await productService.GetCategoriesAsync();
            return Ok(categories);
        }

        [HttpGet("get-brands")]
        public async Task<IActionResult> GetBrands()
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var categories = await productService.GetBrandsAsync();
            return Ok(categories);
        }

        [HttpPost("create-all")]
        public async Task<IActionResult> CreateProductAll([FromForm] ProductReqDto model)
        {
            var (userId, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            try
            {
                // Create product
                var createRes = await productService.CreateProductAsync(model.ProductInfor, userId);
                if (!createRes.Success) return ControllerHelper.HandleResponse(createRes, this);
                var productId = createRes.Data != null ? Convert.ToInt32(createRes.Data) : 0;

                // Create specifications
                if (model.Specifications != null && model.Specifications.Count != 0)
                {
                    var specRes = await productService.UpdateProductSpecificationAsync(productId, model.Specifications, userId);
                    if (!specRes.Success) return ControllerHelper.HandleResponse(specRes, this);
                }

                // Upload images
                if (model.NewImageUploads != null && model.NewImageUploads.Count != 0)
                {
                    var imageDtos = model.NewImageUploads.Select(file => new ProductImageDto
                    {
                        ImageId = 0,
                        ImageUpload = file
                    }).ToList();

                    var imageRes = await productService.UpdateProductImageAsync(productId, imageDtos, userId);
                    if (!imageRes.Success) return ControllerHelper.HandleResponse(imageRes, this);
                }

                return Ok(new { Success = true, Message = "Product created successfully.", Data = productId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        [HttpPut("update-all/{id}")]
        public async Task<IActionResult> UpdateProductAll(int id, [FromForm] ProductReqDto model)
        {
            var (userId, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            try
            {
                // Update product info
                var infoRes = await productService.UpdateProductAsync(id, model.ProductInfor, userId);
                if (!infoRes.Success) return ControllerHelper.HandleResponse(infoRes, this);

                // Update specifications
                if (model.Specifications != null && model.Specifications.Count != 0)
                {
                    var specRes = await productService.UpdateProductSpecificationAsync(id, model.Specifications, userId);
                    if (!specRes.Success) return ControllerHelper.HandleResponse(specRes, this);
                }

                var existingDtos = new List<ProductImageDto>();
                var newDtos = new List<ProductImageDto>();
                if (model.ExistingImageUploads != null && model.ExistingImageIds != null)
                {
                    // Update images
                    existingDtos = [.. model.ExistingImageIds.Select((imageId, idx) => new ProductImageDto
                    {
                        ImageId = imageId,
                        ImageUpload = model.ExistingImageUploads.ElementAtOrDefault(idx)
                    })];
                }
                
                if(model.NewImageUploads != null)
                {
                    newDtos = [.. model.NewImageUploads.Select(file => new ProductImageDto
                    {
                        ImageId = 0,
                        ImageUpload = file
                    })];
                }

                var allImageDtos = existingDtos.Concat(newDtos).ToList();

                if (allImageDtos.Any())
                {
                    var imageRes = await productService.UpdateProductImageAsync(id, allImageDtos, userId);
                    if (!imageRes.Success) return ControllerHelper.HandleResponse(imageRes, this);
                }

                return Ok(new { Success = true, Message = "Product updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        [HttpPut("update-infor/{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductDetailDto model)
        {
            var (userId, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await productService.UpdateProductAsync(id, model, userId);
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpPut("update-colors/{id}")]
        public async Task<IActionResult> UpdateProductColors(int id, [FromBody] List<ProductColorDto> colors)
        {
            var (userId, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;
            var response = await productService.UpdateProductColorsAsync(id, colors, userId);
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpPut("update-specs/{id}")]
        public async Task<IActionResult> UpdateProductSpecification(int id, [FromBody] List<SpecificationDto> model)
        {
            var (userId, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await productService.UpdateProductSpecificationAsync(id, model, userId);
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpPut("update-images/{id}")]
        public async Task<IActionResult> UpdateProductImage(int id,
            [FromForm] List<IFormFile> ImageUploads,       
            [FromForm] List<int> ImageIds,
            [FromForm] List<int> ColorIds,
            [FromForm] List<IFormFile> NewUploads,
            [FromForm] List<int> NewColorIds
        )
        {
            var (userId, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            // Existing images
            var existingDtos = ImageIds.Select((imageId, idx) => new ProductImageDto
            {
                ImageId = imageId,
                ImageUpload = ImageUploads.ElementAtOrDefault(idx),
                ColorId = ColorIds.ElementAtOrDefault(idx)
            }).ToList();

            // New images
            var newDtos = NewUploads.Select(file => new ProductImageDto
            {
                ImageId = 0,
                ImageUpload = file,
                ColorId = NewColorIds.ElementAtOrDefault(NewUploads.IndexOf(file))
            }).ToList();

            var model = existingDtos.Concat(newDtos).ToList();

            try
            {
                var response = await productService.UpdateProductImageAsync(id, model, userId);
                return ControllerHelper.HandleResponse(response, this);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new { Success = false, Message = ex.Message });
            }
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await productService.DeleteProductAsync(id);
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpPost("glb")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadGlb([FromForm] GlbReq request)
        {
            var (userId, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;
            var file = request.File;
            if (file == null)
                return BadRequest("No file uploaded");

            try
            {
                await productService.UploadGlbAsync(file);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
