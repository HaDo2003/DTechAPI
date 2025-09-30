﻿using DTech.Domain.Entities;
using DTech.Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTech.Domain.Entities;

public partial class Product
{
    [Key]
    [Display(Name = "ID")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ProductId { get; set; }

    [Display(Name = "Brand")]
    [Required(ErrorMessage = "Please select brand of product")]
    public int? BrandId { get; set; }

    [Display(Name = "Category")]
    [Required(ErrorMessage = "Please select category of product")]
    public int? CategoryId { get; set; }

    [Required(ErrorMessage = "Please enter name of product")]
    public string? Name { get; set; }

    public string? Slug { get; set; }

    [Required(ErrorMessage = "Please enter warranty of product")]
    public string? Warranty { get; set; }

    [Display(Name = "Product Status")]
    public bool? StatusProduct { get; set; }

    [Required(ErrorMessage = "Please enter initial cost of product")]
    [Display(Name = "Initial Cost")]
    public decimal? InitialCost { get; set; }

    [Required(ErrorMessage = "Please enter price of product")]
    public decimal? Price { get; set; }

    public decimal? Discount { get; set; }

    public decimal? PriceAfterDiscount { get; set; }

    [Display(Name = "Discount End Date")]
    public DateOnly? EndDateDiscount { get; set; }

    public int? Views { get; set; }

    [Display(Name = "Date of Manufacture")]
    public DateOnly? DateOfManufacture { get; set; }

    [Display(Name = "Made In")]
    public string? MadeIn { get; set; }

    [Display(Name = "Promotion Gift")]
    public string? PromotionalGift { get; set; }

    public string? Photo { get; set; }

    public string? Description { get; set; }

    [Display(Name = "Update Date")]
    public DateTime? UpdateDate { get; set; }

    [Display(Name = "Created By")]
    public string? CreatedBy { get; set; }

    [Display(Name = "Create Date")]
    public DateTime? CreateDate { get; set; }

    [Display(Name = "Updated By")]
    public string? UpdatedBy { get; set; }

    public StatusEnums Status { get; set; } = StatusEnums.Available;

    public virtual Brand? Brand { get; set; }

    public virtual Category? Category { get; set; }

    public virtual ICollection<OrderProduct> OrderProducts { get; set; } = [];

    [Display(Name = "Comment")]
    public virtual ICollection<ProductComment> ProductComments { get; set; } = [];

    public virtual ICollection<ProductImage> ProductImages { get; set; } = [];

    public virtual ICollection<Specification> Specifications { get; set; } = [];
}
