using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DTech.Domain.Entities;

public partial class CustomerCoupon
{
    [Key]
    public int Id { get; set; }

    public string? CustomerId { get; set; }

    public int? CouponId { get; set; }

    public virtual Coupon? Coupon { get; set; }

    public virtual ApplicationUser? Customer { get; set; }
}
