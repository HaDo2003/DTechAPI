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
        UserManager<ApplicationUser> userManager,
        ICustomerRepository customerRepo,
        DTechDbContext context,
        IMapper mapper,
        ITokenService tokenService
    ) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (await customerRepo.CheckPhoneAsync(model.PhoneNumber))
                return BadRequest("Phone number already exists");

            var user = mapper.Map<ApplicationUser>(model);

            using var transaction = await context.Database.BeginTransactionAsync();
            var result = await userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Map RegisterDto → CustomerAddress
            var address = mapper.Map<CustomerAddress>(model);
            address.CustomerId = user.Id;

            // Map RegisterDto → Cart
            var cart = mapper.Map<Cart>(model);
            cart.CustomerId = user.Id;

            await customerRepo.CreateCustomerAddressAsync(address);
            await customerRepo.CreateCartAsync(cart);
            await transaction.CommitAsync();

            //var token = await tokenService.GenerateToken(user);
            return Ok(new { Message = "User registered successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var user = await userManager.FindByNameAsync(model.Account);
            if (user == null)
                return Unauthorized("Invalid account or password");

            var isPasswordValid = await userManager.CheckPasswordAsync(user, model.Password);
            if (!isPasswordValid)
                return Unauthorized("Invalid account or password");

            var token = tokenService.CreateToken(user);

            return Ok(new { token });
        }
    }
}
