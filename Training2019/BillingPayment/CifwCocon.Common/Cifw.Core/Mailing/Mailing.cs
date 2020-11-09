using System;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Cifw.Core.Logging;
using Microsoft.Extensions.Configuration;

namespace Cifw.Core.Mailing
{
    public interface IMailing
    {
        Task SendAsync(MailMessage mailMessage);
        void Send(MailMessage mailMessage);
        void Send(string[] to, string subject, string body);
        Task SendAsync(string to, string subject, string body);
        Task SendAsync(string to, string subject, string body, string attachmentFilename);
    }
    public class Mailing : IMailing
    {
        private readonly ILogger _logger;
        private readonly IConfiguration _configuration;
        protected readonly string User;
        protected readonly string Password;
        protected readonly string Server;
        protected readonly string From;
        protected readonly string Display;
        protected readonly bool Ssl;

        public Mailing(ILogger logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
            User = _configuration["MailConfig:user"];
            Password = _configuration["MailConfig:password"];
            Server = _configuration["MailConfig:server"];
            From = _configuration["MailConfig:from"];
            Display = _configuration["MailConfig:display"];
            bool.TryParse(_configuration["MailConfig:ssl"], out var ssl);
            Ssl = ssl;
        }

        public virtual async Task SendAsync(MailMessage mailMessage)
        {
            if (!string.IsNullOrEmpty(User) && !string.IsNullOrEmpty(Password) && !string.IsNullOrEmpty(Server) && !string.IsNullOrEmpty(From))
            {
                using (var client = new SmtpClient(Server))
                {
                    client.EnableSsl = Ssl;
                    client.Credentials = new NetworkCredential(User, Password);
                    mailMessage.From = new MailAddress(From, Display ?? From);
                    await client.SendMailAsync(mailMessage);
                }
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="mailMessage"></param>
        public void Send(MailMessage mailMessage)
        {
            if (!string.IsNullOrEmpty(User) && !string.IsNullOrEmpty(Password) && !string.IsNullOrEmpty(Server) && !string.IsNullOrEmpty(From))
            {
                using (var client = new SmtpClient(Server))
                {
                    client.EnableSsl = Ssl;
                    client.Credentials = new NetworkCredential(User, Password);
                    mailMessage.From = new MailAddress(From, Display ?? From);
                    client.Send(mailMessage);
                }
                _logger.Info($"Send mail from {mailMessage.From.DisplayName} to {mailMessage.To} successfully!");
            }
        }

        public void Send(string[] to, string subject, string body)
        {
            try
            {
                if (!string.IsNullOrEmpty(User) && !string.IsNullOrEmpty(Password) && !string.IsNullOrEmpty(Server) && !string.IsNullOrEmpty(From) && to.Any())
                {
                    var mailMessage = new MailMessage();
                    using (var client = new SmtpClient(Server))
                    {
                        client.EnableSsl = Ssl;
                        client.Credentials = new NetworkCredential(User, Password);
                        mailMessage.From = new MailAddress(From, Display ?? From);
                        foreach (var mailTo in to)
                        {
                            mailMessage.To.Add(mailTo);
                        }
                        mailMessage.Subject = subject;
                        mailMessage.Body = body;
                        client.Send(mailMessage);
                    }
                    _logger.Info($"Send mail from {mailMessage.From.DisplayName} to {mailMessage.To} successfully!");
                }
            }
            catch (Exception e)
            {
                _logger.Info($"Send mail from {From ?? Display} to {to} unsuccessfully. Cause by: {e.Message}");
            }
        }
        /// <summary>
        /// Send mail async with one mail destination
        /// </summary>
        /// <param name="to"></param>
        /// <param name="subject"></param>
        /// <param name="body"></param>
        /// <returns></returns>
        /// <exception cref="Exception">Send failed</exception>
        public virtual async Task SendAsync(string to, string subject, string body)
        {
            try
            {
                if (!string.IsNullOrEmpty(User) && !string.IsNullOrEmpty(Password) && !string.IsNullOrEmpty(Server) && !string.IsNullOrEmpty(From) && !string.IsNullOrEmpty(to))
                {
                    var mailMessage = new MailMessage();
                    var mailsTo = to.Split(';');
                    using (var client = new SmtpClient(Server))
                    {
                        client.EnableSsl = Ssl;
                        client.Credentials = new NetworkCredential(User, Password);
                        mailMessage.From = new MailAddress(From, Display ?? From);
                        foreach (var mailTo in mailsTo)
                        {
                            if (EmailValidation(mailTo))
                            {
                                mailMessage.To.Add(mailTo);
                            }
                            else
                            {
                                _logger.Error($"{mailTo} is invalid format");
                            }
                        }
                        mailMessage.Subject = subject;
                        mailMessage.Body = body;
                        await client.SendMailAsync(mailMessage);
                    }
                }
            }
            catch (Exception e)
            {
                _logger.Info($"Send mail from {From ?? Display} to {to} unsuccessfully. Cause by: {e.Message}");
            }

        }

        public virtual async Task SendAsync(string to, string subject, string body, string attachmentFilename)
        {
            bool.TryParse(_configuration["MailConfig:messageHtml"], out var isHtml);
            try
            {
                if (!string.IsNullOrEmpty(User) && !string.IsNullOrEmpty(Password) && !string.IsNullOrEmpty(Server) && !string.IsNullOrEmpty(From) && !string.IsNullOrEmpty(to))
                {
                    var mailMessage = new MailMessage();
                    var mailsTo = to.Split(';');
                    using (var client = new SmtpClient(Server))
                    {
                        client.EnableSsl = Ssl;
                        client.Credentials = new NetworkCredential(User, Password);
                        mailMessage.From = new MailAddress(From, Display ?? From);
                        foreach (var mailTo in mailsTo)
                        {
                            if (EmailValidation(mailTo))
                            {
                                mailMessage.To.Add(mailTo);
                            }
                            else
                            {
                                _logger.Error($"{mailTo} is invalid format");
                            }
                        }
                        mailMessage.Subject = subject;
                        mailMessage.Body = body;

                        if (!string.IsNullOrEmpty(attachmentFilename))
                        {
                            var attachment = new Attachment(attachmentFilename, MediaTypeNames.Application.Octet);
                            mailMessage.Attachments.Add(attachment);
                        }
                        mailMessage.IsBodyHtml = isHtml;
                        await client.SendMailAsync(mailMessage);
                    }
                }
            }
            catch (Exception e)
            {
                _logger.Info($"Send mail from {From ?? Display} to {to} unsuccessfully. Cause by: {e.Message}");
            }
        }

        public static bool EmailValidation(string email)
        {
            var regex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");
            var match = regex.Match(email);
            return match.Success;
        }
    }
}