using Api.Consumers;
using MassTransit;
using Api.Consumers;
using EmailService.Api.Consumers;
using Shared.Events;

var builder = WebApplication.CreateBuilder(args);

// Cấu hình MassTransit RabbitMQ
builder.Services.AddMassTransit(x =>
{
    // Đăng ký Consumer vừa tạo
    x.AddConsumer<ContractCreatedConsumer>();
    x.AddConsumer<AccountCreatedConsumer>();

    x.UsingRabbitMq((context, cfg) =>
    {
        // Cấu hình kết nối RabbitMQ (Lấy từ docker-compose)
        cfg.Host("rabbitmq", "/", h => 
        {
            h.Username("guest");
            h.Password("guest");
        });

        // Cấu hình hàng đợi (Queue)
        cfg.ReceiveEndpoint("contract-created-queue", e =>
        {
            e.ConfigureConsumer<ContractCreatedConsumer>(context);
        });
        cfg.ReceiveEndpoint("account-created-queue", e =>
        {
            e.ConfigureConsumer<AccountCreatedConsumer>(context);
        });
    });
});

var app = builder.Build();
app.Run();