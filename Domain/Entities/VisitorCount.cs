using DTech.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTech.Domain.Entities
{
    public partial class VisitorCount
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int Count { get; set; }
        public DateOnly Date { get; set; }
        public int Week { get; set; }
        public DayOfWeekEnums Day { get; set; }
    }
}
