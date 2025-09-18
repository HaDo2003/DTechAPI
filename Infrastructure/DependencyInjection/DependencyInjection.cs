using DTech.Application.Interfaces;
using DTech.Application.Mapping;
using DTech.Application.Services;
using DTech.Application.Settings;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;
using DTech.Infrastructure.Data;
using DTech.Infrastructure.Repositories;
using DTech.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace DTech.Infrastructure.DependencyInjection
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<DTechDbContext>(options =>
                options.UseNpgsql(config.GetConnectionString("DTech")));

            //Identity Configuration
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

            // Jwt Authentication
            var jwtSettings = config.GetSection("Jwt");
            var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY");
            var key = Encoding.UTF8.GetBytes(jwtKey!) ?? throw new InvalidOperationException("JWT Key not found");

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = jwtSettings["Issuer"],
                        ValidAudience = jwtSettings["Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ClockSkew = TimeSpan.Zero
                    };
                });

            services.Configure<JwtSettings>(
                config.GetSection("Jwt"));
            services.AddHttpClient();

            //Mapper Configuration
            services.AddAutoMapper(cfg => cfg.AddProfile<MappingProfile>());

            // Register application services
            services.AddScoped<IHomeService, HomeService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ICustomerService, CustomerService>();
            services.AddScoped<ICartService, CartService>();
            services.AddScoped<ICheckOutService, CheckOutService>();
            services.AddScoped<IAdminService, AdminService>();
            services.AddScoped<ICloudinaryService, CloudinaryService>();
            services.AddScoped<IVnPayService, VnPayService>();

            services.AddTransient<IEmailService, EmailService>();
            services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();
            services.AddHostedService<QueuedHostedService>();

            // Register repositories
            services.AddScoped<IAdvertisementRepository, AdvertisementRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IBrandRepository, BrandRepository>();
            services.AddScoped<ICustomerRepository, CustomerRepository>();
            services.AddScoped<ICartRepository, CartRepository>();
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<IPaymentMethodRepository, PaymentMethodRepository>();
            services.AddScoped<ICouponRepository, CouponRepository>();
            services.AddScoped<IPaymentRepository, PaymentRepository>();
            services.AddScoped<IShippingRepository, ShippingRepository>();
            services.AddScoped<IAdminRepository, AdminRepository>();

            return services;
        }
    }
}
