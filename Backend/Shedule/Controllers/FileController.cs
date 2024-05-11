using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shedule.Models.File;
using Shedule.Services.Interfaces;

namespace Shedule.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FileController : ControllerBase
    {
        private readonly IFileService fileService;

        public FileController(IFileService fileService)
        {
             this.fileService = fileService;
        }

        [HttpPost("[action]")]
        [Authorize]
        public async Task<IActionResult> AddFile(IFormFile file)
        {
            return new JsonResult(await fileService.AddFile(file));
        }

        [HttpGet("[action]")]
        [Authorize]
        public async Task<IActionResult> GetAllFiles()
        {
            var resposne = await fileService.GetAllFiles();

            return new JsonResult(resposne);
        }

        [HttpPost("[action]")]
        [Authorize]
        public async Task<IActionResult> DeleteFile(DeleteFileRequest request)
        {
            var response = await fileService.DeleteFile(request);

            return new JsonResult(response);
            
        }

        [HttpPost("[action]")]
        [Authorize]
        public async Task<IActionResult> ChangeDescriptionExcelFile(UpdateFileRequest request)
        {
            var response = await fileService.ChangeDescriptionExcelFile(request);

            return new JsonResult(response);
        }

        [HttpGet("[action]")]
        [Authorize]
        public async Task<IActionResult> SendEmailChangingShedule()
        {
            var response = await fileService.SendEmailAboutChanging();

            return new JsonResult(response);   
        }

        [HttpPost("[action]")]
        [Authorize]
        public async Task<IActionResult> SelectFile(SelectFileRequest request)
        {
            var response = await fileService.SelectFile(request);

            return new JsonResult(response);
        }
    }
}
