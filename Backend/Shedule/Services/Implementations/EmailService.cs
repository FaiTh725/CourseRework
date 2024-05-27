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

            msg.From.Add(new MailboxAddress("Расписании БНТУ", emailAuth.Login));
            msg.To.Add(new MailboxAddress("Перейдите по ссылке что бы ввести новый пароль", email));

            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = $@"<div style=""text-align:center; color: #9e9b9b; font-size: 20px"">
                                        <h1 style=""margin-bottom: 20px; border-bottom: 1px solid #9e9b9b"">В расписание произошли изменения перепроверьте его</h1>
                                        <div style=""display: flex; justify-content: center; align-items:center;text-align: center"">
                                            <img style=""max-width: 800px"" src=""https://img.freepik.com/free-vector/usability-testing-concept-illustration_114360-1571.jpg?t=st=1716831695~exp=1716835295~hmac=0eb2497fdaa474455ba7bd6c29d151507eaa6d1fdc7455b299e3073fe89ecd85&w=826"" alt="""" />
                                        </div>
                                      </div>";

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
