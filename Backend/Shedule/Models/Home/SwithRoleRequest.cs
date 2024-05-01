using Shedule.Domain.Enums;

namespace Shedule.Models.Home
{
    public class SwithRoleRequest : HomeBaseRequest
    {
        public int IdUser { get; set; }

        public int Role { get; set; }
    }
}
