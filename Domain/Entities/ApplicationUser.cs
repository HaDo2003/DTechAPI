using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace DTech.Domain.Entities;

public partial class ApplicationUser : IdentityUser
{
    public string RoleId { get; set; } = string.Empty;

    [Display(Name = "Full Name")]
    public string? FullName { get; set; } = string.Empty;

    public string? Gender { get; set; }

    [Display(Name = "Date of Birth")]
    public DateOnly? DateOfBirth { get; set; }

    public string? Image { get; set; }

    [Display(Name = "Created By")]
    public string? CreatedBy { get; set; }

    [Display(Name = "Create Date")]
    public DateTime? CreateDate { get; set; }

    [Display(Name = "Updated By")]
    public string? UpdatedBy { get; set; }

    [Display(Name = "Update Date")]
    public DateTime? UpdateDate { get; set; }

    public virtual ICollection<Cart> Carts { get; set; } = [];

    public virtual ICollection<CustomerAddress> CustomerAddresses { get; set; } = [];

    public virtual ICollection<CustomerCoupon> CustomerCoupons { get; set; } = [];

    public virtual ICollection<Order> Orders { get; set; } = [];
    public virtual ICollection<WishList> Wishlists { get; set; } = [];
}
