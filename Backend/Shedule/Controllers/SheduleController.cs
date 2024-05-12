using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shedule.Domain.Response;
using Shedule.Models.Shedule;
using Shedule.Services.Interfaces;

namespace Shedule.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class SheduleController : ControllerBase
    {
        private readonly ISheduleService sheduleService;

        public SheduleController(ISheduleService sheduleService)
        {
            this.sheduleService = sheduleService;
        }

        [HttpGet("[action]")]
        [Authorize]
        public async Task<IActionResult> GetAllGroup(int course)
        {
            var response = await sheduleService.GetAllGroup(course);

            return new JsonResult(response);
        }

        [HttpGet("[action]")]
        [Authorize]
        public async Task<IActionResult> GetAllCources()
        {
            var response = await sheduleService.GetAllCourses();

            return new JsonResult(response);
        }

        [HttpGet("[action]")]
        [Authorize]
        public async Task<IActionResult> GetFolovingGroup(int idProfile)
        {
            var response = await sheduleService.GetFolovingGroup(idProfile);

            return new JsonResult(response);
        }

        [HttpPost("[action]")]
        [Authorize]
        public async Task<IActionResult> AddFolovingGroup(FolovingGroupRequest request)
        {
            var response = await sheduleService.AddFolovingGroup(request);

            return new JsonResult(response);
        }

        [HttpPost("[action]")]
        [Authorize]
        public async Task<IActionResult> DeleteFolovingGroup (FolovingGroupRequest request)
        {
            var response = await sheduleService.DeleteFolovingGroup(request);

            return new JsonResult(response);
        }

        [HttpGet("[action]")]
        [Authorize]
        public async Task<IActionResult> GetSheduleGroup(int idGroup)
        {
            var response = await sheduleService.GetSheduleGroup(idGroup);

            return new JsonResult(response);
        }
    }
}
