using AutoMapper;
using DTech.Application.DTOs;
using DTech.Domain.Entities;

namespace DTech.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile() {
            CreateMap<Advertisement, AdvertisementDto>();
            CreateMap<Category, CategoryDto>();
            CreateMap<Brand, BrandDto>();
            CreateMap<Specification, SpecificationDto>();
            CreateMap<ProductImage, ProductImageDto>();
            CreateMap<ProductComment, ProductCommentDto>();

            CreateMap<Product, ProductDto>()
            .ForMember(dest => dest.Specifications, opt => opt.MapFrom(src => src.Specifications))
            .ForMember(dest => dest.ProductImages, opt => opt.MapFrom(src => src.ProductImages))
            .ForMember(dest => dest.ProductComments, opt => opt.MapFrom(src => src.ProductComments));
        }
    }
}
