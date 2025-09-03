using Microsoft.AspNetCore.Http;
namespace DTech.Application.Interfaces
{
    public interface ICloudinaryService
    {
        Task<string> UploadImageAsync(IFormFile file, string folderName);
        Task<string> ChangeImageAsync(string oldfile, IFormFile newfile, string filepath);
        Task<bool> DeleteImageAsync(string imageUrl);
    }
}
