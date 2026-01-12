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

                var orderId = long.Parse(
                    paymentResult.Description.Replace("ORDER_", "")
                ).ToString();

                var result = checkOutService.HandleVnPayCallback(orderId);

                if (result == null)
                {
                    return Redirect($"https://www.dtech-iu.me/order-fail/order-failed");
                }

                return Redirect($"https://www.dtech-iu.me/order-success/{orderId}");
            }
            catch (VnpayException ex)
            {
                Console.WriteLine($"VNPAY Exception: {ex.Message}");
                return Redirect($"https://www.dtech-iu.me/order-fail/order-failed");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                return Redirect($"https://www.dtech-iu.me/order-fail/order-failed");
            }
        }
    }

}