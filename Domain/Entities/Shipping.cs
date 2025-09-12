using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTech.Domain.Entities;

public partial class Shipping
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ShippingId { get; set; }

    public DateOnly? DeliveryDate { get; set; }

    public DateOnly? ReceivedDate { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
