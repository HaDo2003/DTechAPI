using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTech.Domain.Entities
{
    public partial class ProductColor
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ColorId { get; set; }
        public int ProductId { get; set; }
        public string ColorName { get; set; } = string.Empty;
        public string? ColorCode { get; set; }
        public virtual Product? Product { get; set; }
        public virtual ICollection<ProductImage> ProductImages { get; set; } = [];
        public virtual ProductModel? ProductModel { get; set; }
        public virtual ICollection<CartProduct> CartProducts { get; set; } = [];
        public virtual ICollection<OrderProduct> OrderProducts { get; set; } = [];
    }
}
