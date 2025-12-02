using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Microsoft.EntityFrameworkCore;
using Api.Infrastructures;
using Api.Infrastructures.Data;
using Api.Services;
using Api.Services.Interfaces;
using Serilog;
using QuestPDF.Infrastructure;
var builder = WebApplication.CreateBuilder(args);
// Configure QuestPDF License
QuestPDF.Settings.License = LicenseType.Community; // Add this line
// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();

builder.Host.UseSerilog();
try
{
    Log.Information("Starting PdfService with AWS S3...");

    // PostgreSQL Configuration
    builder.Services.AddDbContext<PdfDbContext>(options =>
        options.UseNpgsql(
            builder.Configuration.GetConnectionString("DefaultConnection"),
            npgsqlOptions =>
            {
                npgsqlOptions.MigrationsHistoryTable("__ef_migrations_history");
                npgsqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 5,
                    maxRetryDelay: TimeSpan.FromSeconds(30),
                    errorCodesToAdd: null);
            })
    );

    // ========================================
    // AWS S3 Configuration - UPDATED
    // ========================================
    var awsAccessKey = builder.Configuration["AWS:AccessKey"];
    var awsSecretKey = builder.Configuration["AWS:SecretKey"];
    var awsRegion = builder.Configuration["AWS:Region"] ?? "ap-southeast-1";

    if (string.IsNullOrEmpty(awsAccessKey) || string.IsNullOrEmpty(awsSecretKey))
    {
        Log.Warning("AWS credentials not found in configuration. Trying default credential chain...");
        
        // Use default credential chain (IAM roles, environment variables, etc.)
        var awsOptions = builder.Configuration.GetAWSOptions();
        awsOptions.Region = RegionEndpoint.GetBySystemName(awsRegion);
        builder.Services.AddDefaultAWSOptions(awsOptions);
    }
    else
    {
        Log.Information($"Using AWS credentials from configuration. Region: {awsRegion}");
        
        // Use credentials from appsettings.json
        var awsOptions = new Amazon.Extensions.NETCore.Setup.AWSOptions
        {
            Credentials = new BasicAWSCredentials(awsAccessKey, awsSecretKey),
            Region = RegionEndpoint.GetBySystemName(awsRegion)
        };
        
        builder.Services.AddDefaultAWSOptions(awsOptions);
    }

    builder.Services.AddAWSService<IAmazonS3>();

    // Register Services - UPDATED
    builder.Services.AddScoped<IPdfGenerator, PdfGenerator>();
    builder.Services.AddScoped<IStorageService, AwsS3StorageService>(); 
    builder.Services.AddScoped<ITemplateService, TemplateService>();
    builder.Services.AddScoped<IPdfService, PdfService>();

    // Controllers
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new() 
        { 
            Title = "PDF Service API", 
            Version = "v1",
            Description = "API for generating and managing PDF contracts with AWS S3 storage"
        });
    });

    // CORS
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowAll", policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
    });

    var app = builder.Build();

    // Auto-migrate database on startup
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<PdfDbContext>();
        try
        {
            Log.Information("Applying database migrations...");
            await db.Database.MigrateAsync();
            Log.Information("Database migrations applied successfully");
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error applying database migrations");
        }
    }

    // Middleware
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "PDF Service API V1");
            c.RoutePrefix = string.Empty;
        });
    }

    app.UseSerilogRequestLogging();
    app.UseCors("AllowAll");
    app.UseHttpsRedirection();
    app.UseAuthorization();
    app.MapControllers();

    Log.Information("PdfService started successfully with AWS S3 storage");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application start-up failed");
}
finally
{
    Log.CloseAndFlush();
}