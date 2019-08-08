using System.IO;
using System.Threading.Tasks;
using Cifw.Core.Logging;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
//using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

namespace UpdateCoconPayment
{
    public class Program
    {
        static void Main(string[] args)
        {
            //Startup(args).Wait();   
            try
            {
                BuildWebHost(args).Run();
            }
            catch (System.Exception ex)
            {

                throw;
            }            
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                 //.UseHealthChecks("/hc")
                .ConfigureAppConfiguration((hostingContext, configApp) =>
                {                    
                    configApp.AddJsonFile("appsettings.json", true, true);
                    configApp.AddJsonFile($"appsettings.{hostingContext.HostingEnvironment.EnvironmentName}.json", true, true);
                    configApp.AddCommandLine(args);
                })
                .ConfigureLogging((hostingContext, builder) =>
                {
                    //builder.AddConfiguration(hostingContext.Configuration.GetSection("Logging"));
                    builder.AddDebug();
                    builder.AddConsole();
                }).Build();        
    }
}
