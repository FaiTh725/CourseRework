using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shedule.Models.Porifle;
using Shedule.Models.Profile;
using Shedule.Services.Interfaces;

namespace Shedule.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService profileService;

        public ProfileController(IProfileService profileService)
        {
            this.profileService = profileService;
        }

        [HttpPost("[action]")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile(UpdateProfileRequest request)
        {
            var response = await profileService.UpdateProfile(request);

            return new JsonResult(response);
        }

        [HttpPost("[action]")]
        [Authorize]
        public async Task<IActionResult> UpdateProfileImage([FromForm]int idUser, IFormFile file)
        {
            var response = await profileService.UpdateProfileImage(idUser, file);

            return new JsonResult(response);
        }

        [HttpGet("[action]/{idProfile}")]
        [Authorize]
        public async Task<IActionResult> GetProfile(int idProfile)
        {
            var response = await profileService.GetProfile(idProfile);

            return new JsonResult(response);
        }

        [HttpPost("[action]")]
        [Authorize]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
        {
            var response = await profileService.ResetPassword(request);

            return new JsonResult(response);
        }

        [HttpPost("[action]")]
        [Authorize]
        public async Task<IActionResult> ResetPasswordConfirme(ResetPasswordConfirmeRequest request)
        {
            var token = HttpContext.Request.Headers["Authorization"][0].Split(" ")[1];
            var response = await profileService.ResetPasswordConfirm(request, token);
            
            return new JsonResult(response);    
        }

        [HttpPost("[action]")]
        [Authorize]
        public async Task<IActionResult> NotificationEmail(NotificationEmailRequest request)
        {
            var response = await profileService.NotificationEmail(request);

            return new JsonResult(response);
        }
    }
}
