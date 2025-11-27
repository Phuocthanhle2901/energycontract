using Infrastructure; 
using System.Reflection;
using FluentValidation;
using MediatR;
using Application.Behaviors;
using Api.Middleware;
using Microsoft.EntityFrameworkCore; // Nhớ import namespace của Middleware

var builder = WebApplication.CreateBuilder(args);

// ==========================================
// 1. GIAI ĐOẠN ĐĂNG KÝ SERVICES (DI CONTAINER)
// ==========================================

// A. Xác định Assembly của tầng Application (Nơi chứa toàn bộ logic)
var applicationAssembly = typeof(Application.Features.Contracts.Commands.CreateContract.CreateContractHandler).Assembly;

// B. Đăng ký Infrastructure (Database, Repository)
builder.Services.AddInfrastructureServices(builder.Configuration);

// C. Đăng ký Validators (Tự động tìm tất cả file Validator)
builder.Services.AddValidatorsFromAssembly(applicationAssembly);

// D. Đăng ký MediatR 
builder.Services.AddMediatR(applicationAssembly);

//Đăng ký Pipeline Behavior (Validation)
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviors<,>));
// E. Đăng ký AutoMapper
builder.Services.AddAutoMapper(applicationAssembly);

// F. Đăng ký Controller & Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ==========================================
// 2. GIAI ĐOẠN PIPELINE (MIDDLEWARE)
// ==========================================

// A. Middleware xử lý lỗi toàn cục (Bắt lỗi Validation trả về 400 thay vì 500)
app.UseMiddleware<ExceptionMiddleware>(); 

// B. Swagger (Chỉ hiện khi Dev)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// --- TỰ ĐỘNG MIGRATE DATABASE ---
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<Infrastructure.Persistence.EnergyDbContext>();
        // Lệnh này tương đương với 'dotnet ef database update'
        // Nó sẽ tự tạo DB và bảng nếu chưa có
        if (context.Database.GetPendingMigrations().Any())
        {
            context.Database.Migrate();
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while migrating the database.");
    }
}

app.Run();