using DTech.Application.DTOs.request;
using DTech.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DTech.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController(
        ICustomerService customerService
    ) : ControllerBase
    {
        [HttpPost("send-contact")]
        public async Task<IActionResult> SendContactAsync([FromBody] ContactDto model)
        {
            var response = await customerService.SendContactAsync(model);
            if (!response.Success)
                return BadRequest(new { response.Message });
            return Ok(new { Message = "Send contact successfully." });
        }
    }
}
