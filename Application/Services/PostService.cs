using DTech.Application.DTOs.response.admin;
using DTech.Application.DTOs.Response.Admin.Category;
using DTech.Application.DTOs.Response.Admin.Post;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using Ganss.Xss;

namespace DTech.Application.Services
{
    public class PostService(
        IPostRepository postRepo,
        IPostCategoryRepository postCategoryRepo,
        IAdminRepository adminRepo,
        ICloudinaryService cloudinaryService,
        HtmlSanitizer sanitizer
    ) : IPostService
    {
        readonly string folderName = "Pre-thesis/Post";

        public async Task<IndexResDto<List<PostIndexDto>>> GetPostsAsync()
        {
            var posts = await postRepo.GetAllPostsAsync();
            if (posts == null || posts.Count == 0)
            {
                return new IndexResDto<List<PostIndexDto>>
                {
                    Success = false,
                    Message = "No post found"
                };
            }

            var postDtos = posts.Select(p => new PostIndexDto
            {
                Id = p.PostId,
                Name = p.Name,
                PostDate = p.PostDate,
                PostBy = p.PostBy,
                PostCategory = p.Cate?.Name,
            }).ToList();
            foreach(var o in postDtos)
            {
                Console.WriteLine($"{o.Id}: {o.PostCategory}");
            }
            return new IndexResDto<List<PostIndexDto>>
            {
                Success = true,
                Data = postDtos
            };
        }

        public async Task<IndexResDto<PostDetailDto>> GetPostDetailAsync(int postId)
        {
            var post = await postRepo.GetPostByIdAsync(postId);
            if (post == null)
            {
                return new IndexResDto<PostDetailDto>
                {
                    Success = false,
                    Message = "Post not found"
                };
            }

            var postDetail = new PostDetailDto
            {
                Name = post.Name,
                Description = post.Description,
                Status = post.Status,
                Image = post.Image,
                PostBy = post.PostBy,
                PostDate = post.PostDate,
                PostCategoryId = post.Cate != null ? post.Cate.CategoryId : 0,
                PostCategory = post.Cate != null ? post.Cate.Name : "N/A"
            };

            return new IndexResDto<PostDetailDto>
            {
                Success = true,
                Data = postDetail
            };
        }

        public async Task<IndexResDto<object?>> CreatePostAsync(PostDetailDto model, string? currentUserId)
        {
            try
            {

                Post post = new()
                {
                    Name = model.Name,
                    Status = model.Status,
                    PostDate = DateTime.UtcNow,
                    PostBy = await adminRepo.GetAdminFullNameAsync(currentUserId),
                    Description = sanitizer.Sanitize(model.Description ?? string.Empty),
                    CateId = model.PostCategoryId
                };
                post.Slug = post.Name?.ToLower().Replace(" ", "-").Replace("/", "-");

                var exists = await postRepo.CheckIfPostExistsAsync(post);
                if (exists)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = "Post with same title exists",
                        Data = null
                    };
                }

                if (model.ImageUpload != null && model.ImageUpload.Length > 0)
                {
                    string imageName = await cloudinaryService.UploadImageAsync(
                        model.ImageUpload,
                        folderName
                    );

                    if (string.IsNullOrEmpty(imageName))
                    {
                        return new IndexResDto<object?>
                        {
                            Success = false,
                            Message = "Image upload failed",
                            Data = null
                        };
                    }

                    post.Image = imageName;
                }

                var (Success, Message) = await postRepo.CreatePostAsync(post);

                if (!Success)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = Message,
                        Data = null
                    };
                }

                return new IndexResDto<object?>
                {
                    Success = true,
                    Message = "Post created successfully",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new IndexResDto<object?>
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<IndexResDto<object?>> UpdatePostAsync(int postId, PostDetailDto model, string? currentUserId)
        {
            try
            {
                Post post = new()
                {
                    PostId = postId,
                    Name = model.Name,
                    Description = model.Description,
                    Status = model.Status,
                    PostDate = DateTime.UtcNow,
                    PostBy = await adminRepo.GetAdminFullNameAsync(currentUserId),
                    Image = model.Image,
                    CateId = model.PostCategoryId
                };

                string newSlug = model.Name?.ToLower().Replace(" ", "-").Replace("/", "-") ?? string.Empty;
                post.Slug = newSlug;

                var exists = await postRepo.CheckIfPostExistsAsync(post);
                if (exists)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = "Post with the same name already exists",
                        Data = null
                    };
                }

                if (model.ImageUpload != null && model.ImageUpload.Length > 0)
                {
                    string imageName = await cloudinaryService.ChangeImageAsync(
                        oldfile: model.Image ?? string.Empty,
                        newfile: model.ImageUpload,
                        filepath: folderName
                    );

                    if (string.IsNullOrEmpty(imageName))
                    {
                        return new IndexResDto<object?>
                        {
                            Success = false,
                            Message = "Image upload failed",
                            Data = null
                        };
                    }

                    post.Image = imageName;
                }

                var (Success, Message) = await postRepo.UpdatePostAsync(post);
                if (!Success)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = Message,
                        Data = null
                    };
                }

                return new IndexResDto<object?>
                {
                    Success = true,
                    Message = "Post updated successfully",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new IndexResDto<object?>
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<IndexResDto<object?>> DeletePostAsync(int postId)
        {
            try
            {
                var (Success, Message) = await postRepo.DeletePostAsync(postId);
                if (!Success)
                {
                    return new IndexResDto<object?>
                    {
                        Success = false,
                        Message = Message,
                        Data = null
                    };
                }

                return new IndexResDto<object?>
                {
                    Success = true,
                    Message = "Post deleted successfully",
                    Data = null
                };
            }
            catch (Exception ex)
            {
                return new IndexResDto<object?>
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}",
                    Data = null
                };
            }
        }

        public async Task<List<CategoryResDto>> GetCategoriesAsync()
        {
            var categories = await postCategoryRepo.GetAvailablePostCategoriesAsync();
            if (categories == null || categories.Count == 0)
            {
                return [];
            }

            var categoriesDtos = categories.Select(par => new CategoryResDto
            {
                Id = par.CategoryId,
                Name = par.Name,
            }).ToList();

            return categoriesDtos;
        }
    }
}
