using DTech.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTech.Domain.Entities
{
    public partial class Brand
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BrandId { get; set; }

        [Required(ErrorMessage = "Please enter name of brand")]
        public string? Name { get; set; }

        public string? Slug { get; set; }

        public string? Logo { get; set; }

        [Display(Name = "Created By")]
        public string? CreatedBy { get; set; }

        [Display(Name = "Create Date")]
        public DateTime? CreateDate { get; set; }

        [Display(Name = "Updated By")]
        public string? UpdatedBy { get; set; }

        [Display(Name = "Update Date")]
        public DateTime? UpdateDate { get; set; }
        public StatusEnums Status { get; set; } = StatusEnums.Available;

        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}