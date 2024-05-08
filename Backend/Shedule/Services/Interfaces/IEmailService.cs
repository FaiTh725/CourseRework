namespace Shedule.Services.Interfaces
{
    public interface IEmailService
    {
        Task SendEmail(string email, string subject, string message);

        Task NotificationAboutChangingSheduleFiles(string email);
    }
}
