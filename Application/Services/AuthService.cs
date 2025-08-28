using AutoMapper;
using DTech.Application.DTOs.request;
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
        ITokenService tokenService,
        IEmailService emailService,
        IBackgroundTaskQueue backgroundTaskQueue
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

        public async Task<AuthResponse> ForgotPasswordAsync(ForgotPasswordDto model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return new AuthResponse { Success = false, Message = "Email not found" };

            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            var resetLink = $"http://localhost:5173/reset-password?email={model.Email}&token={Uri.EscapeDataString(token)}";

            backgroundTaskQueue.QueueBackgroundWorkItem(async token =>
            {
                var subject = "Password Reset Request";
                var body = $@"
                    <html>
                        <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;'>
                            <div style='max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);'>
                                <h2 style='color: #333;'>Password Reset Request</h2>
                                <p>Hello,</p>
                                <p>We received a request to reset your password. Click the button below to proceed:</p>
                                <div style='text-align: center; margin: 30px 0;'>
                                    <a href='{resetLink}' style='background-color: #4CAF50; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px; font-size: 16px;'>
                                        Reset Password
                                    </a>
                                </div>
                                <p>If you did not request a password reset, please ignore this email.</p>
                                <p>Thank you,<br/>DTeam</p>
                            </div>
                        </body>
                    </html>";
                await emailService.SendEmailAsync(model.Email, subject, body);
            });
            return new AuthResponse { Success = true, Message = "Password reset link has been sent to your email" };
        }

        public async Task<AuthResponse> ResetPasswordAsync(ResetPasswordDto model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return new AuthResponse { Success = false, Message = "Invalid email" };
            var result = await userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
            if (!result.Succeeded)
            {
                return new AuthResponse
                {
                    Success = false,
                    Message = string.Join("; ", result.Errors.Select(e => e.Description))
                };
            }
            return new AuthResponse { Success = true, Message = "Password has been reset successfully" };
        }
    }
}
