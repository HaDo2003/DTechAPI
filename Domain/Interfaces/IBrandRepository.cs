using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface IBrandRepository
    {
        Task<Brand?> GetBrandBySlugAsync(string? slug);
        //Task<Brand?> GetBrandByIdAsync(int brandId);
    }
}
