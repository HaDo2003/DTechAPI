using DTech.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTech.Domain.Entities;

public partial class Post
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int PostId { get; set; }

    [Display(Name = "Post Category")]
    public int? CateId { get; set; }

    [Required(ErrorMessage = "Please enter title")]
    [Display(Name = "Title")]
    public string? Name { get; set; }

    public string? Slug { get; set; }

    public string? Image { get; set; }

    public string? Description { get; set; }

    [Display(Name = "Post Date")]
    public DateTime? PostDate { get; set; }

    [Display(Name = "Posted By")]
    public string? PostBy { get; set; }
    public StatusEnums Status { get; set; } = StatusEnums.Available;
    [Display(Name = "Post Category")]
    public virtual PostCategory? Cate { get; set; }

    public virtual ICollection<PostComment> PostComments { get; set; } = new List<PostComment>();
}
