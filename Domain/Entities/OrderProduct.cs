using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTech.Domain.Entities;

public partial class OrderProduct
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public string? OrderId { get; set; }

    public int? ProductId { get; set; }
    public decimal? Price { get; set; }

    public int? Quantity { get; set; }

    public decimal? CostAtPurchase { get; set; }
    public string? PromotionalGift { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual Product Product { get; set; } = null!;
}
