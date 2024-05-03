using Shedule.Domain.Response;
using Shedule.Models.File;

namespace Shedule.Services.Interfaces
{
    // TODO Сделать норммальные классы response
    public interface IFileService
    {
        Task<BaseResponse<AddFileResponse>> AddFile(IFormFile file);

        Task<BaseResponse<IEnumerable<AddFileResponse>>> GetAllFiles();

        Task<BaseResponse<object>> DeleteFile(DeleteFileRequest request);

        Task<BaseResponse<AddFileResponse>> ChangeDescriptionExcelFile(UpdateFileRequest request);
    }
}
