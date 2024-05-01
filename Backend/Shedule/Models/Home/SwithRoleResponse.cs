using Shedule.Domain.Enums;

namespace Shedule.Models.Home
{
    public class SwithRoleResponse
    {
        public int IdUser { get; set; }
        
        public string Login {  get; set; }

        public Role Role { get; set; }
    }
}
