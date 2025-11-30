using Infrastructure;
using Serilog;
using Serilog.Events;
using FluentValidation;
using Api.Middleware;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. GIAI ĐOẠN ĐĂNG KÝ SERVICES (DI CONTAINER)
// ==========================================

// Tạo logger ban đầu để bắt lỗi khởi động
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    Log.Information("Starting web host for EnergyContractService...");
    // A. Xác định Assembly của tầng Application (Nơi chứa toàn bộ logic)
    var applicationAssembly = typeof(Application.Features.Contracts.Commands.CreateContract.CreateContractHandler).Assembly;

    // B. Đăng ký Infrastructure (Database, Repository)
    builder.Services.AddInfrastructureServices(builder.Configuration);

    // C. Đăng ký Validators (Tự động tìm tất cả file Validator)
    builder.Services.AddValidatorsFromAssembly(applicationAssembly);

    // ================================
    // D. ĐĂNG KÝ CÁC HANDLER (DI)
    // ================================

    // CONTRACTS
    builder.Services.AddTransient<Application.Features.Contracts.Commands.CreateContract.CreateContractHandler>();
    builder.Services.AddTransient<Application.Features.Contracts.Commands.UpdateContract.UpdateContractHandler>();
    builder.Services.AddTransient<Application.Features.Contracts.Commands.GetContract.GetContractByIdHandler>();
    builder.Services.AddTransient<Application.Features.Contracts.Commands.GetContractsByChoice.GetContractsByChoiceHandler>();
    builder.Services.AddTransient<Application.Features.Contracts.Commands.DeleteContract.DeleteContractHandler>();

    // ADDRESSES
    builder.Services.AddTransient<Application.Features.Addresses.Commands.CreateAddress.CreateAddressHandler>();
    builder.Services.AddTransient<Application.Features.Addresses.Commands.GetAllAddresses.GetAllAddressesHandler>();
    builder.Services.AddTransient<Application.Features.Addresses.Commands.DeleteAddress.DeleteAddressHandler>();

    // RESELLERS
    builder.Services.AddTransient<Application.Features.Resellers.Commands.CreateReseller.CreateResellerHandler>();
    builder.Services.AddTransient<Application.Features.Resellers.Commands.GetAllResellers.GetAllResellerHandler>();

    // E. Đăng ký Controller & Swagger
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    // F. CORS Configuration
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(policy =>
        {
            policy.WithOrigins(
                    "http://localhost:5173",
                    "http://127.0.0.1:5173"
                  )
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        });
    });

    var app = builder.Build();

    // ==========================================
    // 2. GIAI ĐOẠN PIPELINE (MIDDLEWARE)
    // ==========================================

    // A. Middleware xử lý lỗi toàn cục
    app.UseMiddleware<ExceptionMiddleware>();

    // B. Swagger (Chỉ hiện khi Dev)
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    // C. CORS (PHẢI ĐẶT TRƯỚC UseAuthorization)
    app.UseCors();

    app.UseHttpsRedirection();
    app.UseAuthorization();
    app.MapControllers();

    // ==========================================
    // 3. TỰ ĐỘNG MIGRATE DATABASE
    // ==========================================
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<Infrastructure.Persistence.EnergyDbContext>();

        if (context.Database.GetPendingMigrations().Any())
        {
            context.Database.Migrate();
        }
    }

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Host terminated unexpectedly");
    throw;
}
finally
{
    Log.CloseAndFlush();
}