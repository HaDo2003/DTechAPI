using System.ComponentModel.DataAnnotations;

namespace DTech.Domain.Entities
{
    public class Ward
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
    }
}
