using DTech.Domain.Entities;

namespace DTech.Domain.Interfaces
{
    public interface IBrandRepository
    {
        Task<Brand?> GetBrandBySlugAsync(string? slug);
        Task<List<Brand>?> GetAllBrandsAsync();
        Task<Brand?> GetBrandByIdAsync(int brandId);
        Task<bool> CheckIfBrandExistsAsync(Brand brand);
        Task<(bool Success, string Message)> CreateBrandAsync(Brand brand);
        Task<(bool Success, string Message)> UpdateBrandAsync(Brand brand);
        Task<(bool Success, string Message)> DeleteBrandAsync(int brandId);
        Task<List<Brand>?> GetAvailableBrandsAsync();
    }
}
