using System.ComponentModel.DataAnnotations;

namespace DTech.Domain.Entities
{
    public partial class CouponUsed
    {
        [Key]
        public int Id { get; set; }
        public int CouponId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public DateTime UsedDate { get; set; }
        public virtual ApplicationUser User { get; set; } = null!;
        public virtual Coupon Coupon { get; set; } = null!;
    }
}
