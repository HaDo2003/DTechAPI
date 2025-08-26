using DTech.Application.Interfaces;
using DTech.Application.Mapping;
using DTech.Application.Services;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using DTech.Infrastructure.Repositories;
using DTech.Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace DTech.Infrastructure.DependencyInjection
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<DTechDbContext>(options =>
                options.UseNpgsql(config.GetConnectionString("DTech")));

            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                // Password settings.
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                //options.Password.RequiredUniqueChars = 1;
                options.Password.RequiredLength = 6;

                // Lockout settings.
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5;
                options.Lockout.AllowedForNewUsers = true;

                // User settings.
                options.User.AllowedUserNameCharacters =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<DTechDbContext>()
            .AddDefaultTokenProviders();

            services.AddAutoMapper(cfg => cfg.AddProfile<MappingProfile>());

            // Register application services
            services.AddScoped<IHomeService, HomeService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();

            // Register repositories
            services.AddScoped<IAdvertisementRepository, AdvertisementRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IBrandRepository, BrandRepository>();
            services.AddScoped<ICustomerRepository, CustomerRepository>();

            return services;
        }
    }
}
