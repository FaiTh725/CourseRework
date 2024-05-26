using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Crmf;
using Shedule.Models.Home;
using Shedule.Services.Interfaces;
using System.Diagnostics.CodeAnalysis;

namespace Shedule.Controllers
{
    
    [ApiController]
    [Route("[controller]")]
    public class HomeController : ControllerBase
    {
        private readonly IHomeService homeService;

        public HomeController(IHomeService homeService)
        {
            this.homeService = homeService;
        }

        [HttpGet("[action]")]
        [Authorize]
        public async Task<IActionResult> GetAllUsers([FromQuery]HomeBaseRequest request)
        {
            var response = await homeService.GetAllUsers(request);

            return new JsonResult(response);
        }

        [HttpPost("[action]")]
        [Authorize]
        public async Task<IActionResult> SwithRole([FromBody]SwithRoleRequest request)
        {
            return new JsonResult(await homeService.SwithRole(request));
        }

    }
}
