using Api.VMs;
using MassTransit;
using MimeKit;
using MailKit.Net.Smtp;

namespace Api.Consumers;

public class ContractCreatedConsumer : IConsumer<ContractCreatedEvent>
{
    private readonly ILogger<ContractCreatedConsumer> _logger;
    private readonly IConfiguration _configuration;

    public ContractCreatedConsumer(ILogger<ContractCreatedConsumer> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    public async Task Consume(ConsumeContext<ContractCreatedEvent> context)
    {
        var msg = context.Message;
        _logger.LogInformation($"[RabbitMQ] Nhận yêu cầu gửi mail cho: {msg.Email}");

        try
        {
            // 1. Đọc cấu hình từ appsettings.json
            var senderName = _configuration["EmailSettings:SenderName"];
            var senderEmail = _configuration["EmailSettings:SenderEmail"];
            var appPassword = _configuration["EmailSettings:AppPassword"];
            var smtpHost = _configuration["EmailSettings:SmtpHost"];
            var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"]!); // Chuyển sang int

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(senderName, senderEmail));
            message.To.Add(new MailboxAddress(msg.FullName, msg.Email));
            message.Subject = $"Xác nhận hợp đồng số {msg.ContractNumber}";

            var bodyBuilder = new BodyBuilder();
            bodyBuilder.HtmlBody = $@"
                <h1>Xin chào {msg.FullName},</h1>
                <p>Hợp đồng năng lượng của bạn <b>({msg.ContractNumber})</b> đã được tạo thành công vào lúc {msg.CreatedAt}.</p>
                <p>Cảm ơn bạn đã sử dụng dịch vụ!</p>";

            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            
            // Sử dụng thông tin từ cấu hình
            await client.ConnectAsync(smtpHost, smtpPort, false);
            await client.AuthenticateAsync(senderEmail, appPassword);

            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            _logger.LogInformation($"✅ Đã gửi mail thành công tới {msg.Email}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[RabbitMQ] Lỗi khi gửi mail");
        }
    }
}