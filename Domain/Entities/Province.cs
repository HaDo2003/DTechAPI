using System.ComponentModel.DataAnnotations;

namespace DTech.Domain.Entities
{
    public partial class Province
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
    }
}
