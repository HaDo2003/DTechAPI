using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTech.Domain.Entities
{
    public partial class Feedback
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FeedbackId { get; set; }

        [Required(ErrorMessage = "Please enter name to give feedback")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "Please enter phone number to give feedback")]
        [Phone(ErrorMessage = "Invalid phone number")]
        public string? PhoneNumber { get; set; }

        [Required(ErrorMessage = "Please enter email to give feedback")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Please write feedback")]
        public string? Detail { get; set; }

        [Display(Name = "Feedback Date")]
        public DateTime? Fbdate { get; set; }
    }
}