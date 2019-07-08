using System;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;

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
