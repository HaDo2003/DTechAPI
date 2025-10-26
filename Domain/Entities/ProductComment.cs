using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTech.Domain.Entities
{
    public partial class ProductComment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CommentId { get; set; }

        public int? ProductId { get; set; }

        public string? Name { get; set; }

        public string? Email { get; set; }

        public string? Detail { get; set; }

        [Display(Name = "Comment Date")]
        public DateTime? CmtDate { get; set; }

        public decimal? Rate { get; set; }

        public virtual Product? Product { get; set; }
    }
}