using DTech.API.Helper;
using DTech.Application.DTOs.Response.Admin.Order;
using DTech.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DTech.API.Controllers.Admin
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin, Seller")]
    public class OrderController(
        IOrderService orderService
    ) : ControllerBase
    {
        [HttpGet("get-orders")]
        public async Task<IActionResult> GetOrders()
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await orderService.GetOrders();
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetOrder(string id)
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await orderService.GetOrderDetailAsync(id);
            return ControllerHelper.HandleResponse(response, this);
        }
    }

}
