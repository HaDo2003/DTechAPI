﻿using DTech.Domain.Entities;
using DTech.Domain.Enums;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DTech.Infrastructure.Repositories
{
    public class PostRepository(DTechDbContext context) : IPostRepository
    {
        public async Task<List<Post>?> GetAllPostsAsync()
        {
            return await context.Posts
                .AsNoTracking()
                .Include(p => p.Cate)
                .OrderBy(p => p.PostId)
                .ToListAsync();
        }

        public async Task<Post?> GetPostByIdAsync(int postId)
        {
            if (postId <= 0)
                return null;

            return await context.Posts
                .AsNoTracking()
                .Include(p => p.Cate)
                .FirstOrDefaultAsync(p => p.PostId == postId);
        }

        public async Task<bool> CheckIfPostExistsAsync(Post post)
        {
            if (post == null)
                return false;

            if (post.PostId > 0)
            {
                return await context.Posts.AnyAsync(p =>
                    p.Slug == post.Slug &&
                    p.PostId != post.PostId);
            }
            else
            {
                return await context.Posts.AnyAsync(p =>
                    p.Slug == post.Slug);
            }
        }

        public async Task<(bool Success, string Message)> CreatePostAsync(Post post)
        {
            if (post == null)
                return (false, "Post is null");

            await context.Posts.AddAsync(post);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Post created successfully");
            else
                return (false, "Failed to create post");
        }

        public async Task<(bool Success, string Message)> UpdatePostAsync(Post post)
        {
            var existingPost = await context.Posts.FindAsync(post.PostId);
            if (existingPost == null)
                return (false, "Post not found");

            existingPost.Name = post.Name;
            existingPost.Slug = post.Slug;
            existingPost.Description = post.Description;
            existingPost.Status = post.Status;
            existingPost.Image = post.Image;
            existingPost.PostDate = DateTime.UtcNow;
            existingPost.PostBy = post.PostBy;
            existingPost.CateId = post.CateId;

            context.Posts.Update(existingPost);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Post updated successfully");
            else
                return (false, "Failed to update post");
        }

        public async Task<(bool Success, string Message)> DeletePostAsync(int postId)
        {
            var post = await context.Posts.FindAsync(postId);
            if (post == null)
                return (false, "Post not found");

            context.Posts.Remove(post);
            var result = await context.SaveChangesAsync();
            if (result > 0)
                return (true, "Post deleted successfully");
            else
                return (false, "Failed to delete post");
        }
    }
}
