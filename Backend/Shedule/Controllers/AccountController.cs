using Microsoft.AspNetCore.Mvc;
using Shedule.Models.Account;
using Shedule.Services.Interfaces;
using System.Diagnostics.CodeAnalysis;
using System.Reflection.Metadata;

namespace Shedule.Controllers
{
    // TODO #1 не возращать refreshtoken
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase 
    {
        private readonly IAccountService accountService;

        public AccountController(IAccountService accountService)
        {
            this.accountService = accountService;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Login(AccountRequest request)
        {
            var response = await accountService.Login(request);

            if(response.StatusCode == Domain.Enums.StatusCode.Ok)
            {

                Response.Cookies.Delete("RefreshToken");
                //Response.Cookies.Append("RefreshToken", response.Data.RefreshToken);

                Response.Cookies.Append("RefreshToken", response.Data.RefreshToken, new CookieOptions
                {
                    HttpOnly = false,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    IsEssential = true,
                    Expires = DateTimeOffset.UtcNow.AddDays(7)
                });
            }

            return new JsonResult(response);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Register(AccountRequest request)
        {
            var response = await accountService.Register(request);

            if (response.StatusCode == Domain.Enums.StatusCode.Ok)
            {
                Response.Cookies.Append("RefreshToken", response.Data.RefreshToken);
            }

            return new JsonResult(response);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> SignOut(SignOutRequets requets)
        {
            var response = await accountService.LogOut(requets);

            if (response.StatusCode == Domain.Enums.StatusCode.Ok)
            {
                Response.Cookies.Delete("RefreshToken");
            }

            return new JsonResult(response);
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> Refresh(/*[FromQuery]string refreshToken*/)
        {
            var response = await accountService.RefreshToken(Request.Cookies["RefreshToken"]);

            if (response.StatusCode == Domain.Enums.StatusCode.Ok)
            {
                //return Unauthorized();
                Response.Cookies.Delete("RefreshToken");
                Response.Cookies.Append("RefreshToken", response.Data.RefreshToken, new CookieOptions
                {
                    HttpOnly = false,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    IsEssential = true,
                    Expires = DateTimeOffset.UtcNow.AddDays(7)
                });
            }
            else if(response.StatusCode == Domain.Enums.StatusCode.InvalidToken)
            {
                Response.Cookies.Delete("RefreshToken");
            }

            //Response.Cookies.Append("RefreshToken", response.Data.RefreshToken);
            return new JsonResult(response);
        }
    }
}
