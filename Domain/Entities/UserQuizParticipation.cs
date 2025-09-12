using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTech.Domain.Entities
{
    public partial class UserQuizParticipation
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserQuizParticipationId { get; set; }
        public string? UserId { get; set; }
        public int? QuizId { get; set; }
        public string? SelectedAnswer { get; set; }
        public DateTime? ParticipationDate { get; set; }
        public bool IsCorrect { get; set; }
        public virtual ApplicationUser? User { get; set; }
        public virtual Quiz? Quiz { get; set; }
    }
}
