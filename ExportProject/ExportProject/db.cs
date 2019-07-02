using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using MySql.Data.MySqlClient;
using Microsoft.EntityFrameworkCore;
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
