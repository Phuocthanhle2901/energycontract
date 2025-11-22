using Infrastructure; // dùng để gọi AddInfrastructureServices
using System.Reflection;
using MediatR;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddInfrastructureServices(builder.Configuration);
// đăng ký MediatR
var applicationAssembly = typeof(Application.Features.Contracts.Commands.CreateContract.CreateContractHandler).Assembly;
builder.Services.AddMediatR(applicationAssembly);
// đăng ký AutoMapper
builder.Services.AddAutoMapper(applicationAssembly);
//đăng ký controler và swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();
// Hiển thị swagger ở môi trường dev
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Chạy ứng dụng
app.Run();