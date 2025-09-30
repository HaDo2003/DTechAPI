using DTech.API.Helper;
using DTech.Application.DTOs.Response.Admin.Feedback;
using DTech.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DTech.API.Controllers.Admin
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin, Seller")]
    public class FeedbackController(
        IFeedbackService feedbackService
    ) : ControllerBase
    {
        [HttpGet("get-feedbacks")]
        public async Task<IActionResult> GetFeedbacks()
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await feedbackService.GetFeedbacks();
            return ControllerHelper.HandleResponse(response, this);
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> GetFeedback(int id)
        {
            var (_, unauthorized) = ControllerHelper.HandleUnauthorized(User, this);
            if (unauthorized != null) return unauthorized;

            var response = await feedbackService.GetFeedbackDetailAsync(id);
            return ControllerHelper.HandleResponse(response, this);
        }
    }

}
