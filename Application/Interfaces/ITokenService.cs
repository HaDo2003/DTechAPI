using DTech.Domain.Entities;

namespace DTech.Application.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(ApplicationUser user);
    }
}
