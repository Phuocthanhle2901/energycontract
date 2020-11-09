using System;
using Microsoft.Extensions.Configuration;

namespace CifwCocon.ImportRepo
{
    public class ApplicationSetting
    {
        private IConfiguration Configuration { get; set; }

        public ApplicationSetting()
        {
            var configuration = new ConfigurationBuilder().SetBasePath(AppDomain.CurrentDomain.BaseDirectory).AddJsonFile("appsettings.json", false).AddEnvironmentVariables();
            Configuration = configuration.Build();
        }

        public string FileType => Configuration["fileType"];
    }
}
