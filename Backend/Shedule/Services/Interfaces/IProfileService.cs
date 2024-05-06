using Shedule.Domain.Response;
using Shedule.Models.Porifle;
using Shedule.Models.Profile;

namespace Shedule.Services.Interfaces
{
    public interface IProfileService
    {
        Task<BaseResponse<ProfileResponse>> UpdateProfile(UpdateProfileRequest request);

        Task<DataResponse> UpdateProfileImage(int idUser, IFormFile file);

        Task<BaseResponse<ProfileResponse>> GetProfile(int idProfile);

        Task<DataResponse> ResetPassword(ResetPasswordRequest request);

        Task<DataResponse> ResetPasswordConfirm(ResetPasswordConfirmeRequest request, string token);

        Task<DataResponse> NotificationEmail(NotificationEmailRequest request);
    }
}
