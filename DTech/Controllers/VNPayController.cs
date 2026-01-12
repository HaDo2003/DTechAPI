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
        public IActionResult VnPayCallback()
        {
            try
            {
                var paymentResult = vnpayClient.GetPaymentResult(this.Request);

                var orderId = paymentResult.Description.Replace("ORDER_", "");

                var result = checkOutService.HandleVnPayCallback(orderId);

                if (result == null)
                {
                    return Redirect($"https://www.dtech-iu.me/order-fail");
                }

                return Redirect($"https://www.dtech-iu.me/order-success/{orderId}");
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