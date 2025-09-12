using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTech.Domain.Entities
{
    public partial class MonthlyRecap
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal TotalCost { get; set; }
        public decimal Profit { get; set; }
        public int TotalLaptops { get; set; }
        public int TotalSmartPhone { get; set; }
        public int TotalTablet { get; set; }
        public int TotalAccessory { get; set; }
    }
}
