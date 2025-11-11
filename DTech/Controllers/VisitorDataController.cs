using DTech.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DTech.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VisitorDataController(IVisitorDataService visitorDataService) : ControllerBase
    {
        [HttpPut("update-visitor-count")]
        public async Task<IActionResult> UpdateVisitorCountAsync()
        {
            var response = await visitorDataService.UpdateVisitorCountAsync();
            if (response == null)
                return NotFound(new { Message = "Fail to update visitor count" });
            if (!response.Success)
                return BadRequest(new { response.Message });
            return Ok(response);
        }
    }
}
