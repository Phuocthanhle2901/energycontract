using IFD.Logging;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SendingRawSOAPRequest.Services;
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
            ISearchOneService service = serviceProvider.GetService<ISearchOneService>();
            //string ticket_Group = config["requestParams:searchFirstSixty:ticket_Group"];
            //string aantal = config["requestParams:searchFirstSixty:aantal"];
            string ticket_Nummer = config["requestParams:searchOne:ticket_Nummer"];
            service.SearchOne(ticket_Nummer);
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
            serviceCollection.AddSingleton<ISearchFirstSixtyService, SearchFirstSixtySerivce>();
            serviceCollection.AddSingleton<ISearchOneService, SearchOneService>();
        }
    }
}
