using Microsoft.AspNetCore.Mvc;

namespace DTech.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CheckOutController : ControllerBase
    {
        [HttpGet]
        public IActionResult Index()
        {
            return Ok("Checkout works");
        }
    }
}
