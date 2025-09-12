using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTech.Domain.Entities;

public partial class CustomerCoupon
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string? CustomerId { get; set; }

    public int? CouponId { get; set; }

    public virtual Coupon? Coupon { get; set; }

    public virtual ApplicationUser? Customer { get; set; }
}
