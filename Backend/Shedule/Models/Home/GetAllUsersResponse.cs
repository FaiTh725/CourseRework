using Shedule.Domain.Entities;
using Shedule.Domain.Enums;

namespace Shedule.Models.Home
{
    public class GetAllUsersResponse
    {
        public List<UserView> Users { get; set; }
    }

    public class UserView
    {
        public int Id { get; set; }

        public string login { get; set; }

        public Role Role { get; set; }

        public string ImageProfile { get; set; }
    }
}
