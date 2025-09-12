using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTech.Domain.Entities
{
    public partial class SearchHistory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SearchHistoryId { get; set; }
        public string? UserId { get; set; }
        public string? SearchTerm { get; set; }
        public DateTime? SearchDate { get; set; }
        public virtual ApplicationUser? User { get; set; }
    }
}
