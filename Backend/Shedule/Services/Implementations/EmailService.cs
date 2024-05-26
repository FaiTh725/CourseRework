using MailKit.Net.Smtp;
using MimeKit;
using Shedule.Models.Email;
using Shedule.Services.Interfaces;
using static System.Net.WebRequestMethods;

namespace Shedule.Services.Implementations
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration configuration;

        public EmailService(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public async Task NotificationAboutChangingSheduleFiles(string email)
        {
            var emailAuth = configuration.GetSection("EmailAuthentification").Get<EmailAuth>();

            MimeMessage msg = new MimeMessage();

            msg.From.Add(new MailboxAddress("Расписании", emailAuth.Login));
            msg.To.Add(new MailboxAddress("Перейдите по ссылке что бы ввести новый пароль", email));

            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = $@"<h1>В расписании произошли изменения перепроверьте его<h1/>";

            msg.Body = bodyBuilder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync("smtp.mail.ru", 465);
                await client.AuthenticateAsync(emailAuth.Login, emailAuth.Password);
                await client.SendAsync(msg);
                await client.DisconnectAsync(true);
            }
        }

        public async Task SendEmail(string email, string subject, string message)
        {
            var emailAuth = configuration.GetSection("EmailAuthentification").Get<EmailAuth>();

            MimeMessage msg = new MimeMessage();

            msg.From.Add(new MailboxAddress("Восстановление пароля", emailAuth.Login));
            msg.To.Add(new MailboxAddress("Перейдите по ссылке что бы ввести новый пароль", email));
            msg.Subject = subject;

            var bodyBuilder = new BodyBuilder();
            //bodyBuilder.HtmlBody = $@"<a href='http://localhost:5173/ResetPassword?token={message}'>Изменить пароль<a/>";
            bodyBuilder.HtmlBody = $@"<a href='http://localhost:4000/ResetPassword?token={message}'>Изменить пароль<a/>";

            msg.Body = bodyBuilder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync("smtp.mail.ru", 465);
                await client.AuthenticateAsync(emailAuth.Login, emailAuth.Password);
                await client.SendAsync(msg);
                await client.DisconnectAsync(true);
            }
        }
    }
}
