using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTech.Domain.Entities
{
    public partial class WishList
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int WishListId { get; set; }
        public string? CustomerId { get; set; }

        public int? ProductId { get; set; }

        public virtual ApplicationUser? Customer { get; set; }

        public virtual Product? Product { get; set; }
    }
}
