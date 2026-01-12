using DTech.Application.Interfaces;
using DTech.Application.Mapping;
using DTech.Application.Services;
using DTech.Application.Settings;
using DTech.Domain.Entities;
using DTech.Infrastructure.Data;
using DTech.Infrastructure.Repositories;
using DTech.Infrastructure.Services;
using DTech.Infrastructure.Services.Background;
using Ganss.Xss;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;
using VNPAY.Extensions;

namespace DTech.Infrastructure.DependencyInjection
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<DTechDbContext>(options =>
                options.UseNpgsql(config.GetConnectionString("DTech")));

            var vnpayConfig = config.GetSection("VNPAY");

            services.AddVnpayClient(config =>
            {
                config.TmnCode = vnpayConfig["TmnCode"]!;
                config.HashSecret = vnpayConfig["HashSecret"]!;
                config.CallbackUrl = vnpayConfig["CallbackUrl"]!;
                config.BaseUrl = vnpayConfig["BaseUrl"]!;
            });

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

                    // Configure JWT for SignalR
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];
                            var path = context.HttpContext.Request.Path;
                            
                            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                            {
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }
                    };
                });

            services.Configure<JwtSettings>(
                config.GetSection("Jwt"));
            services.AddHttpClient();

            services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                });

            //Regiter Sanitizer
            services.AddScoped(_ =>
            {
                var sanitizer = new HtmlSanitizer();
                sanitizer.AllowedAttributes.Add("style");
                sanitizer.AllowedCssProperties.Add("text-align");
                sanitizer.AllowedCssProperties.Add("margin-left");
                sanitizer.AllowedCssProperties.Add("color");
                return sanitizer;
            });

            //Mapper Configuration
            services.AddAutoMapper(cfg => cfg.AddProfile<MappingProfile>());

            // Register application services
            var serviceAssembly = typeof(AdminService).Assembly;
            foreach (var type in serviceAssembly.GetTypes())
            {
                if (type.IsClass && !type.IsAbstract && type.Name.EndsWith("Service"))
                {
                    var interfaceType = type.GetInterface($"I{type.Name}");
                    if (interfaceType != null)
                    {
                        services.AddScoped(interfaceType, type);
                    }
                }
            }

            services.AddScoped<IVnPayService, VnPayService>();
            services.AddScoped<ICloudinaryService, CloudinaryService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IUnitOfWorkService, UnitOfWorkService>();
            services.AddTransient<IEmailService, EmailService>();
            services.AddSingleton<IBackgroundTaskQueue, BackgroundTaskQueue>();
            services.AddHostedService<QueuedHostedService>();
            services.AddHostedService<CodeStatusCheckerService>();

            // Register repositories
            var repoAssembly = typeof(AdminRepository).Assembly;
            foreach (var type in repoAssembly.GetTypes())
            {
                if (type.IsClass && !type.IsAbstract && type.Name.EndsWith("Repository"))
                {
                    var interfaceType = type.GetInterface($"I{type.Name}");
                    if (interfaceType != null)
                    {
                        services.AddScoped(interfaceType, type);
                    }
                }
            }

            services.AddSignalR();
            
            services.AddSingleton<IUserIdProvider, CustomUserIdProvider>();

            return services;
        }
    }
}
