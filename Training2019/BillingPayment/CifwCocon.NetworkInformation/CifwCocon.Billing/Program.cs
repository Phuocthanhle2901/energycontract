using System;
using System.IO;
using System.Threading.Tasks;
using AutoMapper;
using CifwCocon.Billing.App;
using CifwCocon.ImportBiz;
using CifwCocon.ImportBiz.Base;
using CifwCocon.ImportBiz.Common.Sftp;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;


namespace CifwCocon.Billing
{
    public class Program
    {
        private static IFD.Logging.ILogger _logger;
        private static IConfiguration Configuration { get; set; }
        public static int Main(string[] args)
        {
            //Startup(args).Wait();
            try
            {
                var serviceCollection = new ServiceCollection();
                ConfigureServices(serviceCollection);
                // create service provider
                var serviceProvider = serviceCollection.BuildServiceProvider();
                // entry to run app
                var serviceImport = serviceProvider.GetService<IBillingBiz>();
                _logger = serviceProvider.GetService<IFD.Logging.ILogger>();
                _logger.SetCorrelationId(Guid.NewGuid().ToString());
                serviceImport.Sync();
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
            serviceCollection.AddSingleton(s => Configuration);                       
            serviceCollection.AddSingleton<IFD.Logging.ILogger, IFD.Logging.Log4NetAdapter>();
            serviceCollection.AddAutoMapper();
            serviceCollection.AddTransient(typeof(IBizBase<>), typeof(BizBase<>));
            serviceCollection.AddTransient<IBillingBiz, BillingBiz>();
            serviceCollection.AddTransient<ISftp, Sftp>();
            serviceCollection.AddHostedService<BillingHostedService>();
        }
    }
}
