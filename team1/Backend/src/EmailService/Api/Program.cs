using Api.Consumers;
using MassTransit;
using Api.Consumers;

var builder = WebApplication.CreateBuilder(args);

// Cấu hình MassTransit RabbitMQ
builder.Services.AddMassTransit(x =>
{
    // Đăng ký Consumer vừa tạo
    x.AddConsumer<ContractCreatedConsumer>();

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
    });
});

var app = builder.Build();
app.Run();