using IFD.Logging;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.IO;

namespace SendingRawSOAPRequest
{
    class Program
    {
        static IConfiguration config;
        static void Main(string[] args)
        {
            var serviceCollection = new ServiceCollection();
            ConfigureServices(serviceCollection);
            var serviceProvider = serviceCollection.BuildServiceProvider();
            IConfiguration config = serviceProvider.GetService<IConfiguration>();
            ILogger logger = serviceProvider.GetService<ILogger>();
            var xmlUltis = new TicketRequest(config,logger);
            xmlUltis.SearchFistSixty("styx","60");
            Console.ReadKey();
        }
        private static void ConfigureServices(IServiceCollection serviceCollection)
        {
            var builder = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
               .AddJsonFile("appsetting.json", false);
            config = builder.Build();
            // add services
            serviceCollection.AddSingleton(ks => config);
            serviceCollection.AddSingleton<ILogger, Log4NetAdapter>();
        }
    }
}
