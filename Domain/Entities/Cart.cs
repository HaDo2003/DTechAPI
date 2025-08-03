using System.ComponentModel.DataAnnotations;

namespace DTech.Domain.Entities;
public partial class Cart
{
    [Key]
    public int CartId { get; set; }

    public string? CustomerId { get; set; }

    public virtual ApplicationUser? Customer { get; set; }
    public virtual ICollection<CartProduct> CartProducts { get; set; } = new List<CartProduct>();

}
