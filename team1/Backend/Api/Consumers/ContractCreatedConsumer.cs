using Api.Vms;
using MassTransit;
using MimeKit;
using MailKit.Net.Smtp;
using MailKit.Security;

namespace Api.Consumers;

public class ContractCreatedConsumer : IConsumer<ContractCreatedEvent>
{
    private readonly ILogger<ContractCreatedConsumer> _logger;
    
    public ContractCreatedConsumer(ILogger<ContractCreatedConsumer> logger)
    {
        _logger = logger;
    }
    
    public async Task Consume(ConsumeContext<ContractCreatedEvent> context)
    {
        var msg = context.Message;
        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Energy System", "ngoquanghuy1603@gmail.com"));
            message.To.Add(new MailboxAddress(msg.FullName, msg.Email));
            message.Subject = $"Xác nhận hợp đồng số {msg.ContractNumber}";

            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = $@"
                <h1>Xin chào {msg.FullName},</h1>
                <p>Hợp đồng năng lượng của bạn <b>({msg.ContractNumber})</b> đã được tạo thành công vào lúc {msg.CreatedAt}.</p>
                <p>Cảm ơn bạn đã sử dụng dịch vụ!</p>";

            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync("ngoquanghuy1603l@gmail.com", "Huy16032004@");
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            _logger.LogInformation($"✅ Đã gửi mail thành công tới {msg.Email}");
        }
        catch (Exception ex)
        {
            _logger.LogError($"❌ Lỗi khi gửi mail: {ex.Message}");
            throw;
        }
    }
}
