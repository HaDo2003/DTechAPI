using DTech.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VNPAY;
using VNPAY.Models.Exceptions;

namespace DTech.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class VNPayController(
        ICheckOutService checkOutService,
        IVnpayClient vnpayClient
    ) : ControllerBase
    {
        [HttpGet("vnpay-callback")]
        public async Task<IActionResult> VnPayCallback()
        {
            try
            {
                var paymentResult = vnpayClient.GetPaymentResult(this.Request);

                var orderId = paymentResult.Description.Replace("ORDER_", "");

                var result = await checkOutService.HandleVnPayCallback(orderId);

                if (result == null || !result.Success)
                {
                    return Redirect($"https://www.dtech-iu.me/order-fail");
                }

                // Pass order data as query parameters
                var queryParams = $"?email={Uri.EscapeDataString(result.Email ?? "")}" +
                                 $"&phone={Uri.EscapeDataString(result.Phone ?? "")}" +
                                 $"&totalCost={result.TotalCost}" +
                                 $"&shippingCost={result.ShippingCost}" +
                                 $"&finalCost={result.FinalCost}" +
                                 $"&paymentMethod={Uri.EscapeDataString(result.PaymentMethod?.Description ?? "VNPay")}";

                return Redirect($"https://www.dtech-iu.me/order-success/{orderId}{queryParams}");
            }
            catch (VnpayException ex)
            {
                Console.WriteLine($"VNPAY Exception: {ex.Message}");
                return Redirect($"https://www.dtech-iu.me/order-fail");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                return Redirect($"https://www.dtech-iu.me/order-fail");
            }
        }
    }

}