using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTech.Domain.Entities
{
    public partial class ProductModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ModelId { get; set; }
        public int ColorId { get; set; }
        public string? ModelName { get; set; }
        public string? ModelUrl { get; set; }
        public string? ModelType { get; set; }
        public DateTime? UploadedDate { get; set; }
        public virtual ProductColor? ProductColor { get; set; } = null!;
    }
}
