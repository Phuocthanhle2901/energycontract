using System;
using Cifw.Core.Ftp;
using IFD.Logging;
using CifwCocon.ImportBiz;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using CifwCocon.NetworkInformation.Biz.Notification;
using CifwCocon.Utility;

namespace CifwCocon.ImportAddress
{
    class Program
    {
        private static ILogger _logger;
        private static IConfiguration Configuration { get; set; }
        
        static int Main(string[] args)
        {
            try
            {
                var serviceCollection = new ServiceCollection();
                ConfigureServices(serviceCollection);
                // create service provider
                var serviceProvider = serviceCollection.BuildServiceProvider();
                // entry to run app
                var serviceImport = serviceProvider.GetService<IImportAddressService>();
                _logger = serviceProvider.GetService<ILogger>();
                _logger.SetCorrelationId(Guid.NewGuid().ToString());
                serviceImport.DoImportationByFtp();
                return 0;
            }
            catch (Exception e)
            {
                _logger.Error("Import address job error:", e);
                return 1;
            }
            finally
            {
                _logger.ResetAdditionalCorrelations();
            }
        }
        private static void ConfigureServices(IServiceCollection serviceCollection)
        {
            var configuration = new ConfigurationBuilder().SetBasePath(AppDomain.CurrentDomain.BaseDirectory).AddJsonFile("appsettings.json", false).AddEnvironmentVariables();
            Configuration = configuration.Build();
            // add services
            serviceCollection.AddSingleton(s=> Configuration);
            serviceCollection.AddSingleton<ILogger, Log4NetAdapter>();
            serviceCollection.AddTransient<IImportAddressService, ImportAddressService>();
            serviceCollection.AddTransient<IFtpService, FtpService>();
            serviceCollection.AddTransient<NotificationClient>();
            serviceCollection.AddTransient<INotificationService, NotificationService>();
        }
    }
}
