namespace Shedule.Models.Porifle
{
    public class ProfileResponse
    {
        public string About { get; set; } = string.Empty;

        public string BirthDay { get; set; } = string.Empty;    

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Base64Image {  get; set; } = string.Empty;

        public bool NotificationEmail { get; set; } = false;

    }
}
