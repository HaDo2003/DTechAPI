using AutoMapper;
using DTech.Application.DTOs;
using DTech.Application.DTOs.response;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace DTech.Application.Services
{
    public class AuthService(
        ICustomerRepository customerRepo,
        IMapper mapper,
        UserManager<ApplicationUser> userManager,
        ITokenService tokenService
    ) : IAuthService
    {
        public async Task<AuthResponse> LoginAsync(LoginDto model)
        {
            var user = await userManager.FindByNameAsync(model.Account);
            if (user == null)
                return new AuthResponse { Success = false, Message = "Invalid account or password" };

            var isPasswordValid = await userManager.CheckPasswordAsync(user, model.Password);
            if (!isPasswordValid)
                return new AuthResponse { Success = false, Message = "Invalid account or password" };

            var token = tokenService.CreateToken(user);
            return new AuthResponse { Success = true, Token = token, Message = "Login successful" };
        }
        public async Task<AuthResponse> RegisterAsync(RegisterDto model)
        {
            if (await customerRepo.CheckPhoneAsync(model.PhoneNumber))
                return new AuthResponse { Success = false, Message = "Phone number already exists" };

            var user = mapper.Map<ApplicationUser>(model);

            var result = await userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = string.Join("; ", result.Errors.Select(e => e.Description))
                };
            }

            CustomerAddress address = new()
            {
                CustomerId = user.Id,
                FullName = model.FullName,
                PhoneNumber = model.PhoneNumber,
                Address = model.Address,
                IsDefault = true
            };

            Cart cart = new()
            {
                CustomerId = user.Id
            };

            await customerRepo.CreateCustomerAddressAsync(address);
            await customerRepo.CreateCartAsync(cart);

            var token = tokenService.CreateToken(user);
            return new AuthResponse { Success = true, Token = token, Message = "Registration successful" };
        }
    }
}
