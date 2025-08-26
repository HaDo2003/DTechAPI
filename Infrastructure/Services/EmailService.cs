using DTech.Application.Interfaces;
using System.Net;
using System.Net.Mail;

namespace DTech.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        public Task SendEmailAsync(string email, string subject, string message)
        {
            var client = new SmtpClient("smtp.gmail.com", 587)
            {
                EnableSsl = true,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential("hadotaydo20@gmail.com", "zvaekttdzkdeniga")
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("hadotaydo20@gmail.com"),
                Subject = subject,
                Body = message,
                IsBodyHtml = true
            };
            mailMessage.To.Add(email);

            return client.SendMailAsync(mailMessage);
        }
    }
}
