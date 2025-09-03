using AutoMapper;
using DTech.Application.DTOs.request;
using DTech.Application.DTOs.response;
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
            CreateMap<Product, RelatedProductDto>();

            CreateMap<Product, ProductDto>()
            .ForMember(dest => dest.Specifications, opt => opt.MapFrom(src => src.Specifications))
            .ForMember(dest => dest.ProductImages, opt => opt.MapFrom(src => src.ProductImages))
            .ForMember(dest => dest.ProductComments, opt => opt.MapFrom(src => src.ProductComments));

            CreateMap<RegisterDto, ApplicationUser>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Account))
            .ForMember(dest => dest.RoleId, opt => opt.MapFrom(src => "dc11b0b4-44c2-457f-a890-fce0d077dbe0"))
            .ForMember(dest => dest.CreatedBy, opt => opt.MapFrom(src => src.FullName))
            .ForMember(dest => dest.CreateDate, opt => opt.MapFrom(_ => DateTime.UtcNow))
            .ForMember(dest => dest.Image, opt => opt.MapFrom(_ => "https://res.cloudinary.com/dwbibirzk/image/upload/v1750003485/images_uc75hj.png"));

            CreateMap<RegisterDto, CustomerAddress>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.IsDefault, opt => opt.MapFrom(_ => true))
                .ForMember(dest => dest.ProvinceId, opt => opt.Ignore())
                .ForMember(dest => dest.WardId, opt => opt.Ignore())     
                .ForMember(dest => dest.CustomerId, opt => opt.Ignore());

            CreateMap<RegisterDto, Cart>()
                .ForMember(dest => dest.CustomerId, opt => opt.Ignore());

            CreateMap<CustomerAddress, CustomerAddressDto>();
            CreateMap<CustomerCoupon, CustomerCouponDto>();
            CreateMap<Order, OrderDto>();
            CreateMap<WishList, WishlistDto>();
            CreateMap<ApplicationUser, CustomerDto>();
        }
    }
}
