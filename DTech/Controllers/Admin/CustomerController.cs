using DTech.API.Helper;
using DTech.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DTech.API.Controllers.Admin
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin, Seller")]
    public class CustomerController(ICustomerService customerService) : Controller
    {
        [HttpGet("get-customer")]
        public async Task<IActionResult> GetCustomers()
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await customerService.GetCustomersAsync();
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetAdvertisement(string id)
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await customerService.GetCustomerDetailAsync(id);
            return ControllerHelper.HandleResponse(response, this);
        }
    }
}
