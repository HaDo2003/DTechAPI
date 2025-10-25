using DTech.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace DTech.Infrastructure.Data
{
    public class DTechDbContext : IdentityDbContext<ApplicationUser>
    {
        public DTechDbContext(DbContextOptions<DTechDbContext> options) : base(options)
        {
        }
        public virtual DbSet<Advertisement> Advertisements { get; set; }

        public virtual DbSet<Brand> Brands { get; set; }

        public virtual DbSet<Cart> Carts { get; set; }

        public virtual DbSet<CartProduct> CartProducts { get; set; }

        public virtual DbSet<Category> Categories { get; set; }

        public virtual DbSet<Coupon> Coupons { get; set; }
        public virtual DbSet<CouponUsed> CouponUseds { get; set; }

        public virtual DbSet<CustomerAddress> CustomerAddresses { get; set; }

        public virtual DbSet<CustomerCoupon> CustomerCoupons { get; set; }

        public virtual DbSet<Feedback> Feedbacks { get; set; }

        public virtual DbSet<Order> Orders { get; set; }

        public virtual DbSet<OrderCoupon> OrderCoupons { get; set; }

        public virtual DbSet<OrderProduct> OrderProducts { get; set; }

        public virtual DbSet<OrderStatus> OrderStatuses { get; set; }

        public virtual DbSet<Payment> Payments { get; set; }

        public virtual DbSet<PaymentMethod> PaymentMethods { get; set; }

        public virtual DbSet<Post> Posts { get; set; }

        public virtual DbSet<PostCategory> PostCategories { get; set; }

        public virtual DbSet<PostComment> PostComments { get; set; }

        public virtual DbSet<Product> Products { get; set; }

        public virtual DbSet<ProductComment> ProductComments { get; set; }

        public virtual DbSet<ProductImage> ProductImages { get; set; }
        public virtual DbSet<ProductColor> ProductColors { get; set; }
        public virtual DbSet<ProductModel> ProductModels { get; set; }

        public virtual DbSet<Shipping> Shippings { get; set; }

        public virtual DbSet<Specification> Specifications { get; set; }

        public DbSet<Quiz> Quizzes { get; set; }

        public DbSet<UserQuizParticipation> UserQuizParticipations { get; set; }

        public DbSet<SearchHistory> SearchHistories { get; set; }
        public DbSet<WishList> WishLists { get; set; }

        public DbSet<Province> Provinces { get; set; }
        public DbSet<Ward> Wards { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<VisitorCount> VisitorCounts { get; set; }
        public DbSet<MonthlyRecap> MonthlyRecaps { get; set; }

        protected void OnModelCreatingPartial(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<IdentityUserLogin<String>>().HasNoKey();
            modelBuilder.Entity<IdentityUserToken<String>>().HasNoKey();
            modelBuilder.Entity<IdentityUserRole<String>>().HasNoKey();

            modelBuilder.Entity<UserQuizParticipation>()
                .HasIndex(u => new { u.UserId, u.ParticipationDate })
                .IsUnique();

            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (property.ClrType == typeof(DateTime) || property.ClrType == typeof(DateTime?))
                    {
                        property.SetValueConverter(new ValueConverter<DateTime, DateTime>(
                            v => v.ToUniversalTime(),
                            v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
                        ));
                    }
                }
            }

            base.OnModelCreating(modelBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ProductModel>()
                .HasOne(pm => pm.ProductColor)
                .WithOne(pc => pc.ProductModel)
                .HasForeignKey<ProductModel>(pm => pm.ColorId);

            modelBuilder.Entity<ProductImage>()
                .HasOne(pi => pi.ProductColor)
                .WithMany(pc => pc.ProductImages)
                .HasForeignKey(pi => pi.ColorId);
        }
    }
}
