using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTech.Domain.Entities
{
    public partial class Chat
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? SenderId { get; set; }
        public string? ReceiverId { get; set; }
        public string? Message { get; set; }
        public DateTime Timestamp { get; set; }
        public virtual ApplicationUser? Sender { get; set; }
        public virtual ApplicationUser? Receiver { get; set; }

    }
}
