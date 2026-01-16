using DTech.Domain.Entities;
using DTech.Domain.Enums;
using DTech.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

public static class DbSeeder
{
    public static async Task SeedAsync(DTechDbContext context, IServiceProvider serviceProvider)
    {
        await SeedAdvertisementsAsync(context);
        await SeedBrandsAsync(context);
        await SeedCategoriesAsync(context);
        await SeedCouponsAsync(context);
        await SeedOrderStatusesAsync(context);
        await SeedPaymentMethodsAsync(context);
        await SeedPostCategoriesAsync(context);
        await SeedProvincesAsync(context);
        await SeedRolesAsync(serviceProvider);
        await SeedAdminAsync(serviceProvider);
        await SeedProductsAsync(context);
        await SeedVisitorCountsAsync(context);
    }

    private static async Task SeedRolesAsync(IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        await SeedRolesAsync(roleManager);
    }

    private static async Task SeedAdvertisementsAsync(DTechDbContext context)
    {
        if (await context.Advertisements.AnyAsync())
            return;

        var advertisements = new List<Advertisement>
        {
            new Advertisement
            {
                Name = "Slider 2",
                Slug = "slider-2",
                Order = 3,
                Image = "https://res.cloudinary.com/dwbibirzk/image/upload/v1762016196/Pre-thesis/Advertisement/q5yseoysuwt6zn5b1ncl.jpg",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-11-01 23:56:27.978769"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new Advertisement
            {
                Name = "Slider 5",
                Slug = "slider-5",
                Order = 2,
                Image = "https://res.cloudinary.com/dwbibirzk/image/upload/v1762018779/Pre-thesis/Advertisement/arebtlwq3ealg3gp7euz.png",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-11-02 00:39:29.734966"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new Advertisement
            {
                Name = "Slider 3",
                Slug = "slider-3",
                Order = 1,
                Image = "https://res.cloudinary.com/dwbibirzk/image/upload/v1762018964/Pre-thesis/Advertisement/xyujww6fl9g64gcbzntf.png",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-11-02 00:42:34.820296"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            }
        };

        context.Advertisements.AddRange(advertisements);
        await context.SaveChangesAsync();
    }

    private static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
    {
        string[] roles = { "Admin", "Customer", "Seller" };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole
                {
                    Name = role,
                    NormalizedName = role.ToUpper()
                });
            }
        }
    }

    private static async Task SeedAdminAsync(IServiceProvider serviceProvider)
    {
        var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        const string adminRole = "Admin";
        const string adminEmail = "admin@gmail.com";
        const string adminPassword = "Admin@123";

        // 1️⃣ Ensure role exists
        if (!await roleManager.RoleExistsAsync(adminRole))
        {
            await roleManager.CreateAsync(new IdentityRole
            {
                Name = adminRole,
                NormalizedName = adminRole.ToUpper()
            });
        }

        // 2️⃣ Check if admin user exists
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser != null)
            return;

        // 3️⃣ Create admin user
        adminUser = new ApplicationUser
        {
            UserName = adminEmail,
            Email = adminEmail,
            NormalizedEmail = adminEmail.ToUpper(),
            NormalizedUserName = adminEmail.ToUpper(),

            FullName = "Admin1",
            Gender = "Male",
            DateOfBirth = DateOnly.Parse("2025-04-03"),
            PhoneNumber = "0123456789",
            Image = "https://res.cloudinary.com/dwbibirzk/image/upload/v1758904198/Pre-thesis/Admin/qb8lcx1j5gn4emybhmbj.jpg",

            EmailConfirmed = true,
            PhoneNumberConfirmed = true,

            CreatedBy = "System",
            UpdatedBy = "System",
            CreateDate = DateTime.UtcNow,
            UpdateDate = DateTime.UtcNow
        };

        var result = await userManager.CreateAsync(adminUser, adminPassword);
        if (!result.Succeeded)
        {
            throw new Exception(string.Join(", ",
                result.Errors.Select(e => e.Description)));
        }

        // 4️⃣ Assign Admin role
        await userManager.AddToRoleAsync(adminUser, adminRole);
    }

    private static async Task SeedBrandsAsync(DTechDbContext context)
    {
        if (await context.Brands.AnyAsync())
            return;

        var brands = new List<Brand>
        {
            new Brand
            {
                Name = "Acer",
                Slug = "acer",
                Logo = "https://res.cloudinary.com/dwbibirzk/image/upload/v1746884569/Pre-thesis/Brand/acor55tnwt2w5avgaprf.jpg",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-10 20:42:46.906197"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new Brand
            {
                Name = "Asus",
                Slug = "asus",
                Logo = "https://res.cloudinary.com/dwbibirzk/image/upload/v1746884580/Pre-thesis/Brand/o8mdurdvfgdqofhh2lkf.jpg",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-10 20:42:58.109566"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new Brand
            {
                Name = "Dareu",
                Slug = "dareu",
                Logo = "https://res.cloudinary.com/dwbibirzk/image/upload/v1746884593/Pre-thesis/Brand/dxzi5ptitykasy0datrm.png",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-10 20:43:10.292627"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new Brand
            {
                Name = "Havit",
                Slug = "havit",
                Logo = "https://res.cloudinary.com/dwbibirzk/image/upload/v1746884605/Pre-thesis/Brand/qkfrolz5z5tggamrqa4f.jpg",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-10 20:43:23.151473"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new Brand
            {
                Name = "Logitech",
                Slug = "logitech",
                Logo = "https://res.cloudinary.com/dwbibirzk/image/upload/v1746884617/Pre-thesis/Brand/htudeneeflvic7ilhlzh.jpg",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-10 20:43:35.176115"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new Brand
            {
                Name = "Razer",
                Slug = "razer",
                Logo = "https://res.cloudinary.com/dwbibirzk/image/upload/v1746884630/Pre-thesis/Brand/sclovqgm1nmpi6zgc73r.png",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-10 20:43:47.436616"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new Brand
            {
                Name = "Xiaomi",
                Slug = "xiaomi",
                Logo = "https://res.cloudinary.com/dwbibirzk/image/upload/v1746884643/Pre-thesis/Brand/u4cnjlesuvkqggtu5axi.png",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-10 20:44:01.104049"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new Brand
            {
                Name = "Apple",
                Slug = "apple",
                Logo = "https://res.cloudinary.com/dwbibirzk/image/upload/v1746945795/Pre-thesis/Brand/gtbunzktfzjo1hgjwfla.png",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-11 13:43:13.125175"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new Brand
            {
                Name = "Samsung",
                Slug = "samsung",
                Logo = "https://res.cloudinary.com/dwbibirzk/image/upload/v1746945811/Pre-thesis/Brand/tirktvszz7c2fmsd66zg.png",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-11 13:43:28.809734"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            }
        };

        context.Brands.AddRange(brands);
        await context.SaveChangesAsync();
    }

    private static async Task SeedCategoriesAsync(DTechDbContext context)
    {
        if (await context.Categories.AnyAsync())
            return;

        // 1️⃣ Parent categories
        var parents = new List<Category>
        {
            new Category
            {
                Name = "Laptop",
                Slug = "laptop",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-10 20:44:11.3977"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new Category
            {
                Name = "Smart Phone",
                Slug = "smart-phone",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-10 20:48:37.353317"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new Category
            {
                Name = "Tablet",
                Slug = "tablet",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-10 20:48:45.446741"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new Category
            {
                Name = "Mouse",
                Slug = "mouse",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-10 20:48:53.851"),
                    DateTimeKind.Utc
                ),
                UpdatedBy = "Admin1",
                UpdateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-11 21:03:08.639586"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new Category
            {
                Name = "Keyboard",
                Slug = "keyboard",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-10 20:48:59.424474"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new Category
            {
                Name = "Headphone",
                Slug = "headphone",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-10 20:49:06.190689"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            }
        };

        context.Categories.AddRange(parents);
        await context.SaveChangesAsync();

        // 2️⃣ Fetch parents by slug
        var mouse = await context.Categories.FirstAsync(c => c.Slug == "mouse");
        var keyboard = await context.Categories.FirstAsync(c => c.Slug == "keyboard");
        var headphone = await context.Categories.FirstAsync(c => c.Slug == "headphone");

        // 3️⃣ Child categories
        var children = new List<Category>
        {
            new Category
            {
                Name = "Wireless Mouse",
                Slug = "wireless-mouse",
                ParentId = mouse.CategoryId,
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-10 20:49:22.995"),
                    DateTimeKind.Utc
                ),
                UpdatedBy = "Admin1",
                UpdateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-11 21:03:01.635351"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new Category
            {
                Name = "Wireless Keyboard",
                Slug = "wireless-keyboard",
                ParentId = keyboard.CategoryId,
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-10 20:50:05.172781"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new Category
            {
                Name = "Wireless Headphone",
                Slug = "wireless-headphone",
                ParentId = headphone.CategoryId,
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-10 20:50:16.901456"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new Category
            {
                Name = "Wired Mouse",
                Slug = "wired-mouse",
                ParentId = mouse.CategoryId,
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-10 20:51:01.842"),
                    DateTimeKind.Utc
                ),
                UpdatedBy = "Admin1",
                UpdateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-11 21:02:46.575083"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new Category
            {
                Name = "Wired Keyboard",
                Slug = "wired-keyboard",
                ParentId = keyboard.CategoryId,
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-10 20:51:14.976375"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new Category
            {
                Name = "Wired Headphone",
                Slug = "wired-headphone",
                ParentId = headphone.CategoryId,
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-10 20:51:30.028586"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            }
        };

        context.Categories.AddRange(children);
        await context.SaveChangesAsync();
    }

    private static async Task SeedCouponsAsync(DTechDbContext context)
    {
        if (await context.Coupons.AnyAsync())
            return;

        var coupons = new List<Coupon>
        {
            new Coupon
            {
                Name = "Super Sales",
                Slug = "super-sales",
                Code = "SS2025",
                Discount = 10.00m,
                DiscountType = "Percentage",
                MaxDiscount = 1000,
                Condition = 10000,
                Detail = "Buy more than 10000",
                EndDate = new DateOnly(2026, 5, 31),
                Status = StatusEnums.Available,
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-24 13:14:34.308"),
                    DateTimeKind.Utc
                ),
                UpdatedBy = "Admin1",
                UpdateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-24 13:48:57.966541"),
                    DateTimeKind.Utc
                )
            },
            new Coupon
            {
                Name = "New Friend",
                Slug = "new-friend",
                Code = "NF2026",
                Discount = 500m,
                DiscountType = "Direct",
                MaxDiscount = null,
                Condition = 500,
                Detail = "Buy Something",
                EndDate = new DateOnly(2026, 6, 7),
                Status = StatusEnums.Available,
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-24 13:50:17.18737"),
                    DateTimeKind.Utc
                ),
                UpdatedBy = "Admin1",
                UpdateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-10-05 15:40:22.743309"),
                    DateTimeKind.Utc
                )
            },
            new Coupon
            {
                Name = "Free Ship",
                Slug = "free-ship",
                Code = "FS10",
                Discount = 10m,
                DiscountType = "Direct",
                MaxDiscount = 0,
                Condition = 200,
                Detail = "Buy greater than 200",
                EndDate = new DateOnly(2025, 10, 17),
                Status = StatusEnums.Unavailable,
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-10-02 21:31:04.644105"),
                    DateTimeKind.Utc
                )
            }
        };

        context.Coupons.AddRange(coupons);
        await context.SaveChangesAsync();
    }

    private static async Task SeedOrderStatusesAsync(DTechDbContext context)
    {
        if (await context.OrderStatuses.AnyAsync())
            return;

        var statuses = new List<OrderStatus>
        {
            new OrderStatus { Description = "Order Placed" },
            new OrderStatus { Description = "Order Processing" },
            new OrderStatus { Description = "Shipped" },
            new OrderStatus { Description = "Out for Delivery" },
            new OrderStatus { Description = "Delivered" },
            new OrderStatus { Description = "Order Completed" },
            new OrderStatus { Description = "Order Canceled" },
            new OrderStatus { Description = "Order Returned" }
        };

        context.OrderStatuses.AddRange(statuses);
        await context.SaveChangesAsync();
    }

    private static async Task SeedPaymentMethodsAsync(DTechDbContext context)
    {
        if (await context.PaymentMethods.AnyAsync())
            return;

        var paymentMethods = new List<PaymentMethod>
        {
            new PaymentMethod
            {
                Description = "COD",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-24 13:06:50.752288"),
                    DateTimeKind.Utc
                )
            },
            new PaymentMethod
            {
                Description = "VNPAY",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-05-24 13:07:13.28708"),
                    DateTimeKind.Utc
                )
            }
        };

        context.PaymentMethods.AddRange(paymentMethods);
        await context.SaveChangesAsync();
    }

    private static async Task SeedPostCategoriesAsync(DTechDbContext context)
    {
        if (await context.PostCategories.AnyAsync())
            return;

        var postCategories = new List<PostCategory>
        {
            new PostCategory
            {
                Name = "RECRUITMENT",
                Slug = "recruitment",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-10-02 22:14:24.952507"),
                    DateTimeKind.Utc
                ),
                UpdatedBy = "Admin1",
                UpdateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-11-07 15:01:45.913713"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new PostCategory
            {
                Name = "TECHNOLOGY",
                Slug = "technology",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-11-07 15:00:57.651755"),
                    DateTimeKind.Utc
                ),
                UpdatedBy = "Admin1",
                UpdateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-11-07 15:01:55.208094"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new PostCategory
            {
                Name = "REVIEW",
                Slug = "review",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-11-07 15:01:09.179257"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new PostCategory
            {
                Name = "PROMOTIONAL NEWS",
                Slug = "promotional-news",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-11-07 15:02:27.224897"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            },
            new PostCategory
            {
                Name = "GAME",
                Slug = "game",
                CreatedBy = "Admin1",
                CreateDate = DateTime.SpecifyKind(
                    DateTime.Parse("2025-11-07 15:02:43.490471"),
                    DateTimeKind.Utc
                ),
                Status = StatusEnums.Available
            }
        };

        context.PostCategories.AddRange(postCategories);
        await context.SaveChangesAsync();
    }

    private static async Task SeedProvincesAsync(DTechDbContext context)
    {
        if (await context.Provinces.AnyAsync())
            return;

        var provinces = new List<Province>
        {
            new() { Name = "Hà Nội" },
            new() { Name = "Hải Phòng" },
            new() { Name = "Đà Nẵng" },
            new() { Name = "Cần Thơ" },
            new() { Name = "Thừa Thiên Huế" },
            new() { Name = "Hồ Chí Minh City" },
            new() { Name = "Cao Bằng" },
            new() { Name = "Điện Biên" },
            new() { Name = "Lai Châu" },
            new() { Name = "Lào Cai" },
            new() { Name = "Sơn La" },
            new() { Name = "Lạng Sơn" },
            new() { Name = "Thanh Hóa" },
            new() { Name = "Nghệ An" },
            new() { Name = "Hà Tĩnh" },
            new() { Name = "Quảng Bình" },
            new() { Name = "Quảng Trị" },
            new() { Name = "Quảng Ninh" },
            new() { Name = "Gia Lai" },
            new() { Name = "Kon Tum" },
            new() { Name = "Đắk Lắk" },
            new() { Name = "Đắk Nông" },
            new() { Name = "Lâm Đồng" },
            new() { Name = "Khánh Hòa" },
            new() { Name = "Bình Định" },
            new() { Name = "Ninh Thuận" },
            new() { Name = "Phú Yên" },
            new() { Name = "Bình Dương" },
            new() { Name = "Đồng Nai" },
            new() { Name = "Tây Ninh" },
            new() { Name = "Vĩnh Long" },
            new() { Name = "Đồng Tháp" },
            new() { Name = "Cà Mau" },
            new() { Name = "An Giang" }
        };

        await context.Provinces.AddRangeAsync(provinces);
        await context.SaveChangesAsync();
    }

    private static async Task SeedProductsAsync(DTechDbContext context)
    {
        if (await context.Products.AnyAsync())
            return;

        var products = new List<Product>
    {
        new()
        {
            BrandId = 1,
            CategoryId = 2,
            Name = "Laptop Gaming ASUS TUF Gaming F15 FX507VI-LP088W",
            Slug = "laptop-gaming-asus-tuf-gaming-f15-fx507vi-lp088w",
            Warranty = "12",
            QuantityInStock = 11,
            InitialCost = 2000,
            Price = 2000,
            Discount = 0,
            PriceAfterDiscount = 2000,
            DateOfManufacture = new DateOnly(2025, 05, 02),
            MadeIn = "China",
            Photo = "https://res.cloudinary.com/dwbibirzk/image/upload/v1746885301/Pre-thesis/Product/wxvump6hvocb7cb7dggt.jpg",
            CreatedBy = "Admin1",
            CreateDate = DateTime.UtcNow,
            Status = StatusEnums.Available
        },

        new()
        {
            BrandId=1,
            CategoryId=1,
            Name="Laptop Acer Gaming Nitro V ANV15-51-58AN NH.QNASV.001",
            Slug="laptop-acer-gaming-nitro-v-anv15-51-58an-nh.qnasv.001",
            Warranty="24",
            QuantityInStock=10,
            InitialCost=1200,
            Price=1200,
            Discount=5,
            PriceAfterDiscount=1140,
            DateOfManufacture=new DateOnly(2025,10,02),
            MadeIn="USA",
            Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746885746/Pre-thesis/Product/e51ifoseptysusekwu5u.png",
            CreatedBy="Admin1",
            CreateDate = DateTime.UtcNow,
            Status = StatusEnums.Available
        },

        new() { BrandId=8, CategoryId=1, Name="Laptop MacBook Air 13 inch M4 16GB/256GB", Slug="laptop-macbook-air-13-inch-m4-16gb-256gb", Warranty="12", QuantityInStock=10, InitialCost=1250, Price=1250, Discount=0, PriceAfterDiscount=1250, DateOfManufacture=new DateOnly(2025,05,07), MadeIn="USA", Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746946023/Pre-thesis/Product/lwyuentspx1nbmh5vp5k.jpg", CreatedBy="Admin1", CreateDate = DateTime.UtcNow, Status = StatusEnums.Available },

        new() { BrandId=8, CategoryId=1, Name="Laptop MacBook Pro 14 inch M4 Pro 24GB/512GB", Slug="laptop-macbook-pro-14-inch-m4-pro-24gb-512gb", Warranty="24", QuantityInStock=10, InitialCost=5000, Price=5000, Discount=0, PriceAfterDiscount=5000, DateOfManufacture=new DateOnly(2025,05,02), MadeIn="USA", Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746946074/Pre-thesis/Product/q1wxwsdzinjwwtuobhhk.jpg", CreatedBy="Admin1", CreateDate = DateTime.UtcNow, Status = StatusEnums.Available },

        new() { BrandId=2, CategoryId=1, Name="Laptop ASUS ProArt Studiobook 16 OLED W7600Z3A-L2048W", Slug="laptop-asus-proart-studiobook-16-oled-w7600z3a-l2048w", Warranty="12", QuantityInStock=188, InitialCost=10000, Price=10000, Discount=10, PriceAfterDiscount=9000, DateOfManufacture=new DateOnly(2025,04,28), MadeIn="USA", Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746946172/Pre-thesis/Product/xr4nfloxjtyoqrp22yc1.png", CreatedBy="Admin1", CreateDate = DateTime.UtcNow, Status = StatusEnums.Available },

        new() { BrandId=1, CategoryId=1, Name="LAPTOP ACER ASPIRE 5 A515", Slug="laptop-acer-aspire-5-a515", Warranty="12", QuantityInStock=11, InitialCost=900, Price=900, Discount=0, PriceAfterDiscount=900, MadeIn="China", Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746946251/Pre-thesis/Product/xiz1kwdf772tppvsbwqp.png", CreatedBy="Admin1", CreateDate = DateTime.UtcNow, Status = StatusEnums.Available },

        new() { BrandId=8, CategoryId=1, Name="Laptop MacBook Pro 16 inch M4 Max 36GB/1TB", Slug="laptop-macbook-pro-16-inch-m4-max-36gb-1tb", Warranty="12", QuantityInStock=81, InitialCost=30000, Price=30000, Discount=10, PriceAfterDiscount=27000, DateOfManufacture=new DateOnly(2025,05,08), MadeIn="USA", Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746953751/Pre-thesis/Product/ove0vrvqrx3gxs5eivjj.jpg", CreatedBy="Admin1", CreateDate = DateTime.UtcNow, Status = StatusEnums.Available },

        new() { BrandId=9, CategoryId=2, Name="Samsung Galaxy S25 Ultra 5G 12GB/256GB", Slug="samsung-galaxy-s25-ultra-5g-12gb-256gb", Warranty="12", QuantityInStock=10, InitialCost=1310, Price=1310, Discount=0, PriceAfterDiscount=1310, DateOfManufacture=new DateOnly(2025,05,03), MadeIn="Korea", Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746970381/Pre-thesis/Product/lmkn5tld6zqvletzz0s9.jpg", CreatedBy="Admin1", CreateDate = DateTime.UtcNow, Status = StatusEnums.Available },

        new() { BrandId=9, CategoryId=2, Name="Samsung Galaxy Z Flip6 5G 12GB/512GB", Slug="samsung-galaxy-z-flip6-5g-12gb-512gb", Warranty="24", QuantityInStock=10, InitialCost=1250, Price=1250, Discount=0, PriceAfterDiscount=1250, DateOfManufacture=new DateOnly(2025,05,01), MadeIn="Korea", Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746970505/Pre-thesis/Product/krurykprcvqworha8nbj.jpg", CreatedBy="Admin1", CreateDate = DateTime.UtcNow, Status = StatusEnums.Available },

        new() { BrandId=9, CategoryId=2, Name="Samsung Galaxy S25 Plus 5G 12GB/256GB", Slug="samsung-galaxy-s25-plus-5g-12gb-256gb", Warranty="12", QuantityInStock=10, InitialCost=1040, Price=1040, Discount=0, PriceAfterDiscount=1040, DateOfManufacture=new DateOnly(2025,05,16), MadeIn="Korea", Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746970602/Pre-thesis/Product/tupcxj2x1xoxyyqujt6u.jpg", CreatedBy="Admin1", CreateDate = DateTime.UtcNow, Status = StatusEnums.Available },

        new() { BrandId=8, CategoryId=2, Name="iPhone 16 Pro Max 256GB", Slug="iphone-16-pro-max-256gb", Warranty="24", QuantityInStock=35, InitialCost=1350, Price=1350, Discount=10, PriceAfterDiscount=1215, MadeIn="USA", Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746970665/Pre-thesis/Product/lljuiulfduat9wwebahi.jpg", CreatedBy="Admin1", CreateDate = DateTime.UtcNow, Status = StatusEnums.Available },

        new() { BrandId=8, CategoryId=2, Name="iPhone 15 Pro Max 256GB", Slug="iphone-15-pro-max-256gb", Warranty="24", QuantityInStock=3, InitialCost=1150, Price=1150, Discount=0, PriceAfterDiscount=1150, DateOfManufacture=new DateOnly(2025,05,07), MadeIn="USA", Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746970713/Pre-thesis/Product/vwst2pch6tmkrnfzbvmn.jpg", CreatedBy="Admin1", CreateDate = DateTime.UtcNow, Status = StatusEnums.Available },

        new() { BrandId=7, CategoryId=2, Name="Xiaomi 15 Ultra 5G 16GB/512GB", Slug="xiaomi-15-ultra-5g-16gb-512gb", Warranty="24", QuantityInStock=16, InitialCost=1270, Price=1270, Discount=0, PriceAfterDiscount=1270, DateOfManufacture=new DateOnly(2025,05,02), MadeIn="China", Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746970779/Pre-thesis/Product/mxe24xg0falwlojbp1l3.jpg", CreatedBy="Admin1", CreateDate = DateTime.UtcNow, Status = StatusEnums.Available },

        new() { BrandId=7, CategoryId=2, Name="Xiaomi Redmi Note 14 Pro 8GB/256GB", Slug="xiaomi-redmi-note-14-pro-8gb-256gb", Warranty="12", QuantityInStock=10, InitialCost=310, Price=310, Discount=0, PriceAfterDiscount=310, DateOfManufacture=new DateOnly(2025,05,01), MadeIn="China", Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746970831/Pre-thesis/Product/vxink3arjj5azakkngp9.jpg", CreatedBy="Admin1", CreateDate = DateTime.UtcNow, Status = StatusEnums.Available },

        new() { BrandId=8, CategoryId=3, Name="iPad Air M3 11 inch WiFi 128GB", Slug="ipad-air-m3-11-inch-wifi-128gb", Warranty="12", QuantityInStock=10, InitialCost=650, Price=650, Discount=0, PriceAfterDiscount=650, MadeIn="USA", Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746970912/Pre-thesis/Product/rpyy3hpvgl8hiayje4ya.jpg", CreatedBy="Admin1", CreateDate = DateTime.UtcNow, Status = StatusEnums.Available },

        new() { BrandId=7, CategoryId=3, Name="Xiaomi Pad 7 WiFi 8GB/256GB", Slug="xiaomi-pad-7-wifi-8gb-256gb", Warranty="12", QuantityInStock=10, InitialCost=500, Price=500, Discount=0, PriceAfterDiscount=500, MadeIn="China", Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746970953/Pre-thesis/Product/norl5tjzxn1ymqqvv3hj.jpg", CreatedBy="Admin1", CreateDate = DateTime.UtcNow, Status = StatusEnums.Available },

        new() { BrandId=9, CategoryId=3, Name="Samsung Galaxy Tab S10+ WiFi 12GB/256GB", Slug="samsung-galaxy-tab-s10+-wifi-12gb-256gb", Warranty="24", QuantityInStock=4, InitialCost=885, Price=885, Discount=0, PriceAfterDiscount=885, DateOfManufacture=new DateOnly(2025,05,01), MadeIn="Korea", Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746970995/Pre-thesis/Product/auqeadk7sxghntfmnl1t.jpg", CreatedBy="Admin1", CreateDate = DateTime.UtcNow, Status = StatusEnums.Available },

        new() { BrandId=8, CategoryId=3, Name="iPad Pro M4 11 inch WiFi 256GB", Slug="ipad-pro-m4-11-inch-wifi-256gb", Warranty="12", QuantityInStock=2, InitialCost=1077, Price=1077, Discount=0, PriceAfterDiscount=1077, DateOfManufacture=new DateOnly(2025,05,01), MadeIn="USA", Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746971047/Pre-thesis/Product/ot9sbpvze3kfzc64nj0c.jpg", CreatedBy="Admin1", CreateDate = DateTime.UtcNow, Status = StatusEnums.Available },

        new() { BrandId=9, CategoryId=3, Name="Samsung Galaxy Tab S6 Lite 2024 4G 4GB/64GB", Slug="samsung-galaxy-tab-s6-lite-2024-4g-4gb-64gb", Warranty="12", QuantityInStock=10, InitialCost=270, Price=270, Discount=0, PriceAfterDiscount=270, DateOfManufacture=new DateOnly(2025,04,29), MadeIn="Korea", Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746971114/Pre-thesis/Product/mbamnv8fuql6kjarkxi9.jpg", CreatedBy="Admin1", CreateDate = DateTime.UtcNow, Status = StatusEnums.Available },
        new()
        {
            BrandId = 1,
            CategoryId = 3,
            Name = "iPad Air 6 M2 11 inch 5G 128GB",
            Slug = "ipad-air-6-m2-11-inch-5g-128gb",
            Warranty = "12",
            Discount = 0,
            InitialCost = 770,
            Price = 770,
            PriceAfterDiscount = 770,
            QuantityInStock = 0,
            DateOfManufacture = new DateOnly(2025, 5, 1),
            MadeIn = "USA",
            Photo = "https://res.cloudinary.com/dwbibirzk/image/upload/v1746971153/Pre-thesis/Product/r37gw9kkenkh9htlaxg6.jpg",
            CreatedBy = "Admin1",
            CreateDate = DateTime.SpecifyKind(DateTime.Parse("2025-05-11 14:43:13.177584"), DateTimeKind.Utc),
            Status = StatusEnums.Available
        },
        new() { BrandId=3, CategoryId=12, Name="DareU EH733 Headphones", Slug="dareu-eh733-headphones", Warranty="12", QuantityInStock=10, InitialCost=37, Price=37, Discount=0, PriceAfterDiscount=37, MadeIn="China", Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746971439/Pre-thesis/Product/cnzutgunppuf3jkimneg.jpg", CreatedBy="Admin1", CreateDate = DateTime.UtcNow, Status = StatusEnums.Available },

        new() { BrandId=3, CategoryId=12, Name="Dareu EH416 RGB Black Headphone", Slug="dareu-eh416-rgb-black-headphone", Warranty="12", QuantityInStock=10, InitialCost=20, Price=20, Discount=0, PriceAfterDiscount=20, MadeIn="China", Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746971502/Pre-thesis/Product/f2x7gkygiw1vtatkvalb.jpg", CreatedBy="Admin1", CreateDate = DateTime.UtcNow, Status = StatusEnums.Available },

        new() { BrandId=2, CategoryId=12, Name="ASUS TUF Gaming H3 Gun Metal Headphone", Slug="asus-tuf-gaming-h3-gun-metal-headphone", Warranty="12", QuantityInStock=10, InitialCost=40, Price=40, Discount=0, PriceAfterDiscount=40, MadeIn="Korea", Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746971598/Pre-thesis/Product/ievrwykaicrnx2ai1tbp.jpg", CreatedBy="Admin1", CreateDate = DateTime.UtcNow, Status = StatusEnums.Available },

        new() { BrandId=5, CategoryId=9, Name="Logitech Lightspeed G733 Wireless Headphone", Slug="logitech-lightspeed-g733-wireless-headphone", Warranty="12", QuantityInStock=3, InitialCost=155, Price=155, Discount=0, PriceAfterDiscount=155, MadeIn="USA", Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746971707/Pre-thesis/Product/zj5w2xio4mgzgrsyhyi6.jpg", CreatedBy="Admin1", CreateDate = DateTime.UtcNow, Status = StatusEnums.Available },
        new()
        {
            BrandId = 3,
            CategoryId = 11,
            Name = "DareU EK75 White Black DareU Dream switch mechanical keyboard (PBT keycap)",
            Slug = "dareu-ek75-white-black-dareu-dream-switch-mechanical-keyboard-(pbt-keycap)",
            Warranty = "12",
            Discount = 0,
            InitialCost = 25,
            Price = 25,
            PriceAfterDiscount = 25,
            QuantityInStock = 1,
            MadeIn = "China",
            Photo = "https://res.cloudinary.com/dwbibirzk/image/upload/v1746971872/Pre-thesis/Product/zzrvwv6pdej0jtybowlu.jpg",
            CreatedBy = "Admin1",
            CreateDate = DateTime.SpecifyKind(DateTime.Parse("2025-05-11 13:57:48.781543"), DateTimeKind.Utc),
            Status = StatusEnums.Available
        },

        new()
        {
            BrandId = 5,
            CategoryId = 8,
            Name = "Logitech G PRO X TKL LIGHTSPEED Tactile Black Mechanical Keyboard",
            Slug = "logitech-g-pro-x-tkl-lightspeed-tactile-black-mechanical-keyboard",
            Warranty = "12",
            Discount = 0,
            InitialCost = 180,
            Price = 180,
            PriceAfterDiscount = 180,
            QuantityInStock = 1,
            DateOfManufacture = new DateOnly(2025, 4, 29),
            MadeIn = "USA",
            Photo = "https://res.cloudinary.com/dwbibirzk/image/upload/v1746971985/Pre-thesis/Product/bswaoqtehndbzwexgwdx.jpg",
            CreatedBy = "Admin1",
            CreateDate = DateTime.SpecifyKind(DateTime.Parse("2025-05-11 13:59:41.477143"), DateTimeKind.Utc),
            Status = StatusEnums.Available
        },

        new()
        {
            BrandId = 3,
            CategoryId = 8,
            Name = "DareU EK87 Pro Triple Mode Proto Mechanical Keyboard (Dream Switch)",
            Slug = "dareu-ek87-pro-triple-mode-proto-mechanical-keyboard-(dream-switch)-",
            Warranty = "12",
            Discount = 0,
            InitialCost = 40,
            Price = 40,
            PriceAfterDiscount = 40,
            QuantityInStock = 0,
            MadeIn = "China",
            Photo = "https://res.cloudinary.com/dwbibirzk/image/upload/v1746972084/Pre-thesis/Product/qsvqqxs87pbgpxesonbz.jpg",
            CreatedBy = "Admin1",
            CreateDate = DateTime.SpecifyKind(DateTime.Parse("2025-05-11 14:01:21.09041"), DateTimeKind.Utc),
            Status = StatusEnums.Available
        },

        new()
        {
            BrandId = 2,
            CategoryId = 10,
            Name = "ASUS TUF Gaming M3 II Mouse",
            Slug = "asus-tuf-gaming-m3-ii-mouse",
            Warranty = "12",
            Discount = 0,
            InitialCost = 25,
            Price = 25,
            PriceAfterDiscount = 25,
            QuantityInStock = 0,
            DateOfManufacture = new DateOnly(2025, 5, 7),
            MadeIn = "USA",
            Photo = "https://res.cloudinary.com/dwbibirzk/image/upload/v1746972262/Pre-thesis/Product/evtbjswn6hfgke4sk5x5.jpg",
            CreatedBy = "Admin1",
            CreateDate = DateTime.SpecifyKind(DateTime.Parse("2025-05-11 14:04:18.663014"), DateTimeKind.Utc),
            Status = StatusEnums.Available
        },
        new() { BrandId=5, CategoryId=10, Name="Logitech G102 Gen 2 Lightsync White Mouse", Slug="logitech-g102-gen-2-lightsync-white-mouse", Warranty="12", QuantityInStock=10, InitialCost=23, Price=23, Discount=0, PriceAfterDiscount=23, MadeIn="Korea", Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746972311/Pre-thesis/Product/hffjteanuhmgjkkpqtfr.jpg", CreatedBy="Admin1", CreateDate = DateTime.UtcNow, Status = StatusEnums.Available },

        new() { BrandId=5, CategoryId=7, Name="Logitech G304 LIGHTSPEED Wireless White Mouse", Slug="logitech-g304-lightspeed-wireless-white-mouse", Warranty="24", QuantityInStock=12, InitialCost=34, Price=34, Discount=0, PriceAfterDiscount=34, MadeIn="USA", Photo="https://res.cloudinary.com/dwbibirzk/image/upload/v1746972389/Pre-thesis/Product/ovxwhc4zthvm0c2hw1xj.jpg", CreatedBy="Admin1", CreateDate = DateTime.UtcNow, Status = StatusEnums.Available },
        new Product
        {
            BrandId = 5,
            CategoryId = 8,
            Name = "Logitech POP Keys Wireless Mechanical Keyboard",
            Slug = "logitech-pop-keys-wireless-mechanical-keyboard",
            Warranty = "12",
            QuantityInStock = 95,
            InitialCost = 115,
            Price = 115,
            Discount = 5,
            PriceAfterDiscount = 110,
            Views = 811,
            DateOfManufacture = new DateOnly(2025, 05, 02),
            MadeIn = "USA",
            Photo = "https://res.cloudinary.com/dwbibirzk/image/upload/v1760019739/logipopkey_a7w2gt.png",
            CreatedBy = "Admin1",
            CreateDate = DateTime.SpecifyKind(new DateTime(2025, 10, 11, 21, 06, 26), DateTimeKind.Utc),
            Status = StatusEnums.Available
        },

        new Product
        {
            BrandId = 9,
            CategoryId = 2,
            Name = "Samsung Galaxy S24 5G 8GB/256GB Phone",
            Slug = "samsung-galaxy-s24-5g-8gb-256gb-phone",
            Warranty = "12",
            QuantityInStock = 10,
            InitialCost = 610,
            Price = 610,
            Discount = 0,
            PriceAfterDiscount = 610,
            Views = 2,
            DateOfManufacture = new DateOnly(2025, 10, 08),
            MadeIn = "Japan",
            Photo = "https://res.cloudinary.com/dwbibirzk/image/upload/v1760540702/Pre-thesis/Product/ujuldib35jhrneqcc6aw.jpg",
            CreatedBy = "Admin1",
            CreateDate = DateTime.SpecifyKind(new DateTime(2025, 10, 15, 22, 04, 58), DateTimeKind.Utc),
            UpdateDate = DateTime.SpecifyKind(new DateTime(2025, 10, 15, 22, 25, 24), DateTimeKind.Utc),
            UpdatedBy = "Admin1",
            Status = StatusEnums.Available
        }
    };

        await context.Products.AddRangeAsync(products);
        await context.SaveChangesAsync();
    }

    private static async Task SeedVisitorCountsAsync(DTechDbContext context)
{
    if (await context.VisitorCounts.AnyAsync())
        return;

    var visitorCounts = new List<VisitorCount>
    {
        new VisitorCount { Count = 90,  Date = new DateOnly(2025,10,27), Day = DayOfWeekEnums.Tuesday,   Week = 44 },
        new VisitorCount { Count = 78,  Date = new DateOnly(2025,10,28), Day = DayOfWeekEnums.Wednesday, Week = 44 },
        new VisitorCount { Count = 55,  Date = new DateOnly(2025,10,29), Day = DayOfWeekEnums.Thursday,  Week = 44 },
        new VisitorCount { Count = 81,  Date = new DateOnly(2025,10,30), Day = DayOfWeekEnums.Friday,    Week = 44 },
        new VisitorCount { Count = 64,  Date = new DateOnly(2025,10,31), Day = DayOfWeekEnums.Saturday,  Week = 44 },
        new VisitorCount { Count = 50,  Date = new DateOnly(2025,11,01), Day = DayOfWeekEnums.Sunday,    Week = 44 },
        new VisitorCount { Count = 62,  Date = new DateOnly(2025,11,02), Day = DayOfWeekEnums.Monday,    Week = 44 },

        new VisitorCount { Count = 104, Date = new DateOnly(2025,11,03), Day = DayOfWeekEnums.Tuesday,   Week = 45 },
        new VisitorCount { Count = 35,  Date = new DateOnly(2025,11,04), Day = DayOfWeekEnums.Wednesday, Week = 45 },
        new VisitorCount { Count = 47,  Date = new DateOnly(2025,11,05), Day = DayOfWeekEnums.Thursday,  Week = 45 },
        new VisitorCount { Count = 92,  Date = new DateOnly(2025,11,06), Day = DayOfWeekEnums.Friday,    Week = 45 },
        new VisitorCount { Count = 75,  Date = new DateOnly(2025,11,07), Day = DayOfWeekEnums.Saturday,  Week = 45 },
        new VisitorCount { Count = 50,  Date = new DateOnly(2025,11,08), Day = DayOfWeekEnums.Sunday,    Week = 45 },
        new VisitorCount { Count = 86,  Date = new DateOnly(2025,11,09), Day = DayOfWeekEnums.Monday,    Week = 45 },

        new VisitorCount { Count = 67,  Date = new DateOnly(2025,11,10), Day = DayOfWeekEnums.Tuesday,   Week = 46 },
        new VisitorCount { Count = 2,   Date = new DateOnly(2025,11,11), Day = DayOfWeekEnums.Wednesday, Week = 46 },
        new VisitorCount { Count = 1,   Date = new DateOnly(2025,11,12), Day = DayOfWeekEnums.Thursday,  Week = 46 },

        new VisitorCount { Count = 2,   Date = new DateOnly(2025,11,24), Day = DayOfWeekEnums.Tuesday,   Week = 48 },
        new VisitorCount { Count = 5,   Date = new DateOnly(2025,11,25), Day = DayOfWeekEnums.Wednesday, Week = 48 },
        new VisitorCount { Count = 13,  Date = new DateOnly(2025,11,26), Day = DayOfWeekEnums.Thursday,  Week = 48 },

        new VisitorCount { Count = 5,   Date = new DateOnly(2025,12,07), Day = DayOfWeekEnums.Monday,    Week = 49 },
        new VisitorCount { Count = 5,   Date = new DateOnly(2025,12,07), Day = DayOfWeekEnums.Monday,    Week = 49 },

        new VisitorCount { Count = 2,   Date = new DateOnly(2025,12,10), Day = DayOfWeekEnums.Thursday,  Week = 50 },
        new VisitorCount { Count = 1,   Date = new DateOnly(2025,12,10), Day = DayOfWeekEnums.Thursday,  Week = 50 },

        new VisitorCount { Count = 2,   Date = new DateOnly(2025,12,15), Day = DayOfWeekEnums.Tuesday,   Week = 51 },
        new VisitorCount { Count = 1,   Date = new DateOnly(2025,12,15), Day = DayOfWeekEnums.Tuesday,   Week = 51 },
        new VisitorCount { Count = 3,   Date = new DateOnly(2025,12,19), Day = DayOfWeekEnums.Saturday,  Week = 51 },
        new VisitorCount { Count = 4,   Date = new DateOnly(2025,12,19), Day = DayOfWeekEnums.Saturday,  Week = 51 },
        new VisitorCount { Count = 2,   Date = new DateOnly(2025,12,21), Day = DayOfWeekEnums.Monday,    Week = 51 },
        new VisitorCount { Count = 1,   Date = new DateOnly(2025,12,21), Day = DayOfWeekEnums.Monday,    Week = 51 },

        new VisitorCount { Count = 2,   Date = new DateOnly(2025,12,25), Day = DayOfWeekEnums.Friday,    Week = 52 },
        new VisitorCount { Count = 1,   Date = new DateOnly(2025,12,25), Day = DayOfWeekEnums.Friday,    Week = 52 },

        new VisitorCount { Count = 1,   Date = new DateOnly(2026,01,08), Day = DayOfWeekEnums.Friday,    Week = 2 },
        new VisitorCount { Count = 2,   Date = new DateOnly(2026,01,08), Day = DayOfWeekEnums.Friday,    Week = 2 }
    };

    context.VisitorCounts.AddRange(visitorCounts);
    await context.SaveChangesAsync();
}

}