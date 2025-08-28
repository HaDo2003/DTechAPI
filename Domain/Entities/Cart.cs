using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTech.Domain.Entities;
public partial class Cart
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int CartId { get; set; }

    public string? CustomerId { get; set; }

    public virtual ApplicationUser? Customer { get; set; }
    public virtual ICollection<CartProduct> CartProducts { get; set; } = new List<CartProduct>();

}
