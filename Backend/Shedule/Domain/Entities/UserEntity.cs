using Shedule.Domain.Enums;

namespace Shedule.Domain.Entities
{
    public class UserEntity
    {
        public int Id { get; set; }

        public string Login { get; set; }

        public string Password { get; set; }

        public Role Role { get; set; } = Role.User;

        public string? RefreshToken { get; set; }

        public DateTime RefreshTokenTime { get; set; }

    }
}
