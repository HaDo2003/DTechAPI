using AutoMapper;
using DTech.Application.DTOs;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace DTech.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(
        IAuthService authService
    ) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            var response = await authService.RegisterAsync(model);

            if (!response.Success)
                return BadRequest(new { response.Message });

            return Ok(new { response.Token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var response = await authService.LoginAsync(model);
            if (!response.Success)
                return Unauthorized(new { response.Message });

            return Ok(new { response.Token });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] string email)
        {
            throw new NotImplementedException();
        }
    }
}
