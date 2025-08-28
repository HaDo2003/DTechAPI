using DTech.Application.DTOs.request;
using DTech.Application.DTOs.response;

namespace DTech.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterDto model);
        Task<AuthResponse> LoginAsync(LoginDto model);
        Task<AuthResponse> ForgotPasswordAsync(ForgotPasswordDto model);
        Task<AuthResponse> ResetPasswordAsync(ResetPasswordDto model);
    }
}
