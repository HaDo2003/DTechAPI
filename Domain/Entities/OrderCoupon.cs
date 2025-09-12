using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTech.Domain.Entities;

public partial class OrderCoupon
{
    [Key]
    public int Id { get; set; }
    public string? OrderId { get; set; }

    public int? CouponId { get; set; }

    public virtual Coupon? Coupon { get; set; }

    public virtual Order? Order { get; set; }
}
