using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace DTech.Domain.Entities;

public partial class ProductImage
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ImageId { get; set; }
    public int? ProductId { get; set; }

    [ForeignKey(nameof(ProductColor))]
    public int? ColorId { get; set; }
    public string? Image { get; set; }
    public virtual Product? Product { get; set; }
    public virtual ProductColor? ProductColor { get; set; }
}
