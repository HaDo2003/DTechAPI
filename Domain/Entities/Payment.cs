using DTech.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTech.Domain.Entities;

public partial class Payment
{
    [Key]
    public int PaymentId { get; set; }

    [Display(Name = "Payment Method")]
    public int? PaymentMethodId { get; set; }

    public PaymentStatusEnums Status { get; set; }

    [Display(Name = "Payment Date")]
    public DateOnly? Date { get; set; }

    public decimal? Amount { get; set; }

    [Display(Name = "Created By")]
    public string? CreatedBy { get; set; }

    [Display(Name = "Create Date")]
    public DateTime? CreateDate { get; set; }

    [Display(Name = "Updated By")]
    public string? UpdatedBy { get; set; }

    [Display(Name = "Update Date")]
    public DateTime? UpdateDate { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual PaymentMethod? PaymentMethod { get; set; }
}
