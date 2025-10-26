using System.ComponentModel.DataAnnotations;

namespace DTech.Domain.Entities
{
    public partial class CartProduct
    {
        [Key]
        public int Id { get; set; }
        public int? CartId { get; set; }
        public int? ProductId { get; set; }
        public int Quantity { get; set; }
        public int? ColorId { get; set; }
        public virtual Cart? Cart { get; set; }
        public virtual Product? Product { get; set; }
        public virtual ProductColor? ProductColor { get; set; }
    }
}