using AutoMapper;
using System.Linq;
using DTech.Application.DTOs.request;
using DTech.Application.DTOs.response;
using DTech.Application.DTOs.Response;
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
            CreateMap<ProductColor, ProductColorDto>();
            CreateMap<ProductModel, ProductModelDto>();

            CreateMap<Product, ProductDto>()
            .ForMember(dest => dest.Specifications, opt => opt.MapFrom(src => src.Specifications))
            .ForMember(dest => dest.ProductImages, opt => opt.MapFrom(src => src.ProductImages))
            .ForMember(dest => dest.ProductComments, opt => opt.MapFrom(src => src.ProductComments))
            .ForMember(dest => dest.ProductColors, opt => opt.MapFrom(src => src.ProductColors))
            .ForMember(dest => dest.ProductModels, opt => opt.MapFrom(src =>
                src.ProductColors != null && src.ProductColors.Any()
                ? src.ProductColors
                    .Where(pc => pc.ProductModel != null)
                    .Select(pc => pc.ProductModel!)
                    .ToList()
                : new List<ProductModel>()));

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
            CreateMap<Order, OrderDto>()
                .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.Status != null ? src.Status.Description : null));
            CreateMap<WishList, WishlistDto>();
            CreateMap<ApplicationUser, CustomerDto>();

            CreateMap<UpdateProfileDto, ApplicationUser>()
                .ForMember(dest => dest.UpdateDate, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.UpdatedBy, opt => opt.MapFrom(src => src.FullName));

            CreateMap<AddAddressDto, CustomerAddress>();
            CreateMap<EditAddressDto, CustomerAddress>();
            CreateMap<ProductCommentRequestDto, ProductComment>()
                .ForMember(dest => dest.CmtDate, opt => opt.MapFrom(_ => DateTime.UtcNow));

            CreateMap<ContactDto, Feedback>()
                .ForMember(dest => dest.Fbdate, opt => opt.MapFrom(_ => DateTime.UtcNow));

            CreateMap<DTOs.request.CartProductDto, CartProduct>();

            CreateMap<CartProduct, DTOs.response.CartProductDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.ProductId))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Product != null ? src.Product.Name : null))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Product != null ? src.Product.Price : null))
                .ForMember(dest => dest.Discount, opt => opt.MapFrom(src => src.Product != null ? src.Product.Discount : null))
                .ForMember(dest => dest.PriceAfterDiscount, opt => opt.MapFrom(src => src.Product != null ? src.Product.PriceAfterDiscount : null))
                .ForMember(dest => dest.Photo, opt => opt.MapFrom(src => src.Product != null ? src.Product.Photo : null));

            CreateMap<Cart, CartDto>()
                .ForMember(dest => dest.CartProducts, opt => opt.MapFrom(src => src.CartProducts));

            CreateMap<PaymentMethod, PaymentMethodDto>();
        }
    }
}
