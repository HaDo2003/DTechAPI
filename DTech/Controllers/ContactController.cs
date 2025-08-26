using Microsoft.AspNetCore.Mvc;

namespace DTech.API.Controllers
{
    public class ContactController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
