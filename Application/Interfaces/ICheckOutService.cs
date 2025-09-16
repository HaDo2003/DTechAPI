using DTech.Application.DTOs.request;
using DTech.Application.DTOs.response;
using DTech.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace DTech.Application.Interfaces
{
    public interface ICheckOutService
    {
        Task<CheckOutDto> GetCheckOutAsync(string customerId);
        Task<OrderSummaryResDto> ApplyCouponAsync(string code, string customerId);
        Task<CheckOutDto> BuyNowAsync(string customerId, BuyNowReqDto modelReq);
        Task<OrderSummaryResDto> ApplyCouponBuyNowAsync(string code, string customerId, int productId, int quantity);
        Task<OrderResDto> PlaceOrderAsync(string customerId, CheckOutDto model);
        Task<OrderResDto> HandleVnPayCallbackAsync(IQueryCollection query);
        Task<OrderResDto> GetOrderSuccessAsync(string customerId, string orderId);
    }
}
