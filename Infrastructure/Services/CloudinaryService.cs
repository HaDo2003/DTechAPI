﻿using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DTech.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace DTech.Infrastructure.Services
{
    public class CloudinaryService : ICloudinaryService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryService(IConfiguration configuration)
        {
            var cloudName = Environment.GetEnvironmentVariable("CLOUDINARY_NAME") ?? configuration["Cloudinary:CloudName"];
            var apiKey = Environment.GetEnvironmentVariable("CLOUDINARY_API_KEY") ?? configuration["Cloudinary:ApiKey"];
            var apiSecret = Environment.GetEnvironmentVariable("CLOUDINARY_API_SECRET") ?? configuration["Cloudinary:ApiSecret"];

            var account = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(account);
        }

        public async Task<string> UploadImageAsync(IFormFile file, string folderName)
        {
            if (file == null || file.Length == 0)
                return "noimage.png";

            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(file.FileName, stream),
                Folder = folderName,
                Transformation = new Transformation().Crop("limit").Width(500).Height(500)
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            return uploadResult.SecureUrl.ToString();
        }

        public async Task<string> ChangeImageAsync(string oldfile, IFormFile newfile, string filepath)
        {
            try
            {
                // Delete the old image if it exists
                if (!string.IsNullOrEmpty(oldfile))
                {
                    await DeleteImageAsync(oldfile);
                }

                // Upload the new image
                string imageName = await UploadImageAsync(newfile, filepath);

                return imageName;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error changing image: {ex.Message}");
            }
        }

        public async Task<bool> DeleteImageAsync(string imageUrl)
        {
            try
            {
                if (string.IsNullOrEmpty(imageUrl))
                    return false;

                // Check if it's a Cloudinary URL
                if (!imageUrl.Contains("cloudinary.com"))
                {
                    // Not a Cloudinary URL, nothing to delete
                    return false;
                }

                // Extract the public ID
                string? publicId = ExtractPublicIdFromUrl(imageUrl);

                if (string.IsNullOrEmpty(publicId))
                {
                    throw new Exception("Could not extract public ID from URL");
                }

                var deletionParams = new DeletionParams(publicId)
                {
                    ResourceType = ResourceType.Image
                };

                var result = await _cloudinary.DestroyAsync(deletionParams);

                if (result.Result != "ok" && result.Result != "not found")
                {
                    throw new Exception($"Failed to delete image. Error: {result.Error?.Message}");
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting image: {ex.Message}");
                return false; // Ensure a return value in case of an exception
            }
        }

        public async Task<string> UploadGlbAsync(IFormFile file, string folderName)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("No file provided");

            using var stream = file.OpenReadStream();

            var uploadParams = new RawUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = folderName,
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            return uploadResult.SecureUrl.ToString();
        }

        private static string? ExtractPublicIdFromUrl(string url)
        {
            try
            {
                Uri uri = new(url);

                // Parse the URL path
                string path = uri.AbsolutePath;

                // Split the path by '/'
                string[] parts = path.Split('/');

                // Find the upload part
                int uploadIndex = Array.IndexOf(parts, "upload");
                if (uploadIndex == -1 || uploadIndex == parts.Length - 1)
                {
                    return null;
                }

                // Everything after 'upload' but before the last part (filename with extension)
                List<string> publicIdParts = [];
                for (int i = uploadIndex + 1; i < parts.Length - 1; i++)
                {
                    if (!string.IsNullOrEmpty(parts[i]) && !parts[i].StartsWith("v"))
                    {
                        publicIdParts.Add(parts[i]);
                    }
                }

                // Add the filename without extension
                string fileName = Path.GetFileNameWithoutExtension(parts[^1]);
                publicIdParts.Add(fileName);

                // Join all parts
                return string.Join("/", publicIdParts);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error extracting public ID: {ex.Message}");
                return null;
            }
        }
    }
}
