using Shedule.Domain.Response;
using Shedule.Models.Shedule;

namespace Shedule.Services.Interfaces
{
    public interface ISheduleService
    {
        public Task<bool> ParseExcelFileOfShedule(string selectedFileName);

        public Task<BaseResponse<IEnumerable<CoursesResponse>>> GetAllCourses();
        
        public Task<BaseResponse<IEnumerable<GroupsResponse>>> GetAllGroup(int course);

        public Task<BaseResponse<IEnumerable<GroupsResponse>>> GetFolovingGroup(int idProfile);

        public Task<BaseResponse<GroupsResponse>> AddFolovingGroup(FolovingGroupRequest request);

        public Task<DataResponse> DeleteFolovingGroup(FolovingGroupRequest request);

        public Task<BaseResponse<IEnumerable<GetSheduleGroupResponse>>> GetSheduleGroup(int idGroup);
    }
}
