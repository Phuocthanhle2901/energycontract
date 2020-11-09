using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;

namespace Services
{
    public class GetValueJson
    {
        public MySqlConnection con;
        private static IConfiguration Configuration { get; set; }

        public string GetConfiguration(string key)
        {
            var builder = new ConfigurationBuilder().SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddJsonFile("appsetting.json", false).AddEnvironmentVariables();
            Configuration = builder.Build();
            var result = Configuration[key];
            return result;
        }
    }
}