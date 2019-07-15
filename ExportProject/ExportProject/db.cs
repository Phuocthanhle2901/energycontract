using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;

namespace ExportProject
{
    class db
    {
        IHostingEnvironment env;
        MySqlConnection conn;
        private static IConfiguration Configuration { get; set; }
        public db()
        {
            GetConfiguration();
            conn = new MySqlConnection(Configuration.GetSection("Data").GetSection("ConnectionString").Value);
        }
        public void GetConfiguration()
        {
            var configuration = new ConfigurationBuilder().SetBasePath(AppDomain.CurrentDomain.BaseDirectory).AddJsonFile("appsettings.json", false).AddEnvironmentVariables();
            Configuration = configuration.Build();
        }

    }
}
