using Microsoft.AspNetCore.Mvc;
using DTech.Application.Interfaces;

namespace DTech.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController(IHomeService homeService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetHomeData()
        {
            var data = await homeService.GetHomePageDataAsync();
            return Ok(data);
        }
    }
}
