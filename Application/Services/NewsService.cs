using DTech.Application.DTOs.Response;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DTech.Application.Services
{
    public class NewsService(
        IPostRepository postRepo,
        IPostCategoryRepository postCategoryRepo
    ) : INewsService
    {
        public async Task<PostLayoutDto?> GetAllPostCategoryAsync()
        {
            try {
                var category = await postCategoryRepo.GetAllPostCategoriesAsync();
                var featuredPosts = await postRepo.GetPostsAsync("Feature");
                if (category == null || featuredPosts == null)
                {
                    return null;
                }

                var dtoList = category.Select(c => new PostCategoryDto
                {
                    CategoryId = c.CategoryId,
                    Name = c.Name ?? "Unkown Category",
                    Slug = c.Slug ?? string.Empty
                }).ToList();

                return new PostLayoutDto
                {
                    Categories = dtoList,
                    FeaturedNews = MapPosts(featuredPosts),
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllPostCategoryAsync: {ex.Message}");
                return null;
            }
        }

        public async Task<InitialNewsPage?> GetInitialPageDataAsync()
        {
            try
            {
                var posts = await postRepo.GetPostsAsync("All");
                var sidebarPosts = await postRepo.GetPostsAsync("New");
                var mainPost = await postRepo.GetPostsAsync("Main");

                if (posts == null || sidebarPosts == null || mainPost == null)
                {
                    return null;
                }

                return new InitialNewsPage
                {
                    Posts = MapPosts(posts),
                    SidebarPosts = MapPosts(sidebarPosts),
                    MainPosts = MapPosts(mainPost),
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetInitialPageDataAsync: {ex.Message}");
                return null;
            }
        }

        public async Task<PostCategoyPageDto?> GetPostsByCategoryAsync(string categorySlug, int page, int pageSize)
        {
            try
            {
                if (page <= 0) page = 1;
                if (pageSize <= 0) pageSize = 6;

                var category = await postCategoryRepo.GetPostCategoryBySlugAsync(categorySlug);
                var query = await postRepo.GetPostsByCategorySlugAsync(categorySlug);
                if (query == null || category == null)
                {
                    return null;
                }

                int totalItems = await query.CountAsync();
                int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

                var posts = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                if (posts == null)
                {
                    return null;
                }

                var mappedPosts = MapPosts(posts);
                return new PostCategoyPageDto
                {
                    Title = category.Name ?? "Unknown Category",
                    Posts = mappedPosts,
                    TotalItems = totalItems,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetPostsByCategoryAsync: {ex.Message}");
                return null;
            }
        }
        public async Task<PostDto?> GetPostBySlugAsync(string slug)
        {
            try
            {
                var post = await postRepo.GetPostBySlugAsync(slug);
                if (post == null)
                {
                    return null;
                }

                var postDto = new PostDto()
                {
                    PostId = post.PostId,
                    Name = post.Name,
                    Slug = post.Slug,
                    Description = post.Description,
                    IsFeatured = post.IsFeatured,
                    IsMain = post.IsMain,
                    PostCategoryId = post.PostCategoryId,
                    PostCategory = post.PostCategory?.Name,
                    PostCategorySlug = post.PostCategory?.Slug,
                    Image = post.Image,
                    PostDate = post.PostDate,
                    PostBy = post.PostBy
                };
                return postDto;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetPostByIdAsync: {ex.Message}");
                return null;
            }
        }

        private static List<PostDto> MapPosts(List<Post> posts)
        {
            return posts.Select(p => new PostDto
            {
                PostId = p.PostId,
                Name = p.Name,
                Slug = p.Slug,
                Description = p.Description,
                IsFeatured = p.IsFeatured,
                IsMain = p.IsMain,
                PostCategoryId = p.PostCategoryId,
                PostCategory = p.PostCategory?.Name,
                PostCategorySlug = p.PostCategory?.Slug,
                Image = p.Image,
                PostDate = p.PostDate,
                PostBy = p.PostBy
            }).ToList();
        }
    }
}
