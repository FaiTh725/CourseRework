using Shedule.Domain.Response;
using Shedule.Models.Home;
using System.Runtime.CompilerServices;

namespace Shedule.Services.Interfaces
{
    public interface IHomeService
    {
        public Task<BaseResponse<GetAllUsersResponse>> GetAllUsers(HomeBaseRequest request);

        public Task<BaseResponse<SwithRoleResponse>> SwithRole(SwithRoleRequest request);
    }
}
