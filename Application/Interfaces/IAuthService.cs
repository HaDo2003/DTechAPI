using DTech.Application.DTOs;
using DTech.Application.DTOs.response;

namespace DTech.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> RegisterAsync(RegisterDto model);
        Task<AuthResponse> LoginAsync(LoginDto model);
    }
}
