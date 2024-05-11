namespace Shedule.Domain.Entities
{
    public class ProfileEntity
    {

        public int Id { get; set; }

        public int UserId { get; set; }

        public UserEntity User { get; set; }

        public string UserName { get; set; } = string.Empty;

        public string? About { get; set; } = string.Empty;   

        public string? Email { get; set; } = string.Empty;

        public DateTime? BirthDay { get; set; }

        public byte[]? LogoImage { get; set; } = new byte[0];

        public bool NotificationEmail { get; set; } = false;

        public List<SheduleGroup> FolovingGroup = new();
    }
}
