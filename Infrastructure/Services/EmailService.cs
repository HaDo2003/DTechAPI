using DTech.Application.Interfaces;
using System.Net;
using System.Net.Mail;

namespace DTech.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        public async Task SendEmailAsync(string email, string subject, string message)
        {
            try
            {
                Console.WriteLine($"info: DTech.Infrastructure.Services.EmailService[10001]");
                Console.WriteLine($"      Attempting to send email");
                Console.WriteLine($"      [From=hadotaydo20@gmail.com, To={email}]");
                Console.WriteLine($"      Subject: {subject}");
                
                // Try port 587 first (TLS)
                var client = new SmtpClient("smtp.gmail.com", 587)
                {
                    EnableSsl = true,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential("hadotaydo20@gmail.com", "zvaekttdzkdeniga"),
                    Timeout = 30000 // 30 seconds timeout
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress("hadotaydo20@gmail.com"),
                    Subject = subject,
                    Body = message,
                    IsBodyHtml = true
                };
                mailMessage.To.Add(email);

                await client.SendMailAsync(mailMessage);
                Console.WriteLine($"      Email sent successfully to {email}");
            }
            catch (SmtpException smtpEx)
            {
                Console.WriteLine($"error: DTech.Infrastructure.Services.EmailService[10002]");
                Console.WriteLine($"      SMTP Error sending email to {email}");
                Console.WriteLine($"      StatusCode: {smtpEx.StatusCode}");
                Console.WriteLine($"      Message: {smtpEx.Message}");
                
                // Try alternative port 465 (SSL)
                try
                {
                    Console.WriteLine($"      Retrying with port 465 (SSL)...");
                    var client = new SmtpClient("smtp.gmail.com", 465)
                    {
                        EnableSsl = true,
                        UseDefaultCredentials = false,
                        Credentials = new NetworkCredential("hadotaydo20@gmail.com", "zvaekttdzkdeniga"),
                        Timeout = 30000
                    };

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress("hadotaydo20@gmail.com"),
                        Subject = subject,
                        Body = message,
                        IsBodyHtml = true
                    };
                    mailMessage.To.Add(email);

                    await client.SendMailAsync(mailMessage);
                    Console.WriteLine($"      Email sent successfully via port 465");
                }
                catch (Exception retryEx)
                {
                    Console.WriteLine($"error: DTech.Infrastructure.Services.EmailService[10003]");
                    Console.WriteLine($"      Failed to send email after retry: {retryEx.Message}");
                    // Don't throw - log and continue
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"error: DTech.Infrastructure.Services.EmailService[10004]");
                Console.WriteLine($"      Unexpected error sending email to {email}");
                Console.WriteLine($"      Exception: {ex.GetType().Name}");
                Console.WriteLine($"      Message: {ex.Message}");
                // Don't throw - log and continue
            }
        }
    }
}
