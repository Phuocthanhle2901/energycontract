using System;
using System.Globalization;
using Cifw.Core;
using Cifw.Core.Enums;
using Microsoft.Extensions.Configuration;
using Xunit;
namespace CifwCocon.ImportUnitTest
{
    public class ConfigurationTest
    {
        private static IConfiguration Configuration { get; set; }
        public ConfigurationTest()
        {
            var configuration = new ConfigurationBuilder().SetBasePath(AppDomain.CurrentDomain.BaseDirectory).AddJsonFile("appsettings.json", false).AddEnvironmentVariables();
            Configuration = configuration.Build();
        }
       
        [Fact]
        public void GetConfiguration()
        {
            var mappingConfiguration = Configuration["mappingColumn"];
            var connectionString = Configuration["Data:CifwCocon2018DbContextDevelopment:ConnectionString"];
            var keyConfiguration = Configuration["keyConfiguration"];
            Assert.NotEmpty(mappingConfiguration);
            Assert.NotEmpty(connectionString);
            Assert.NotEmpty(keyConfiguration);
        }

        [Fact]
        public void ParseDateTime()
        {
            var datetime1 = "12/6/2017 0:00";
            var datetime2 = "13-6-2017 0:00:00";
            //var datetimeparse1 = DateTime.Parse(datetime1);
            //var datetimeparse2 = DateTime.Parse(datetime2);
            //var datetimeparse3 = DateTime.ParseExact(datetime1, "dd-MM-yyyy h:mm:ss", CultureInfo.InvariantCulture);
            //var datetimeparse4 = DateTime.ParseExact(datetime2, "dd-MM-yyyy h:mm:ss", CultureInfo.InvariantCulture);
            if (!DateTime.TryParse(datetime2, out var hasbegin))
            {
                hasbegin = DateTime.ParseExact(datetime2, "d-M-yyyy h:mm:ss", CultureInfo.InvariantCulture);
            }         
        }

        [Fact]
        public void Parse_String_Enum()
        {
            var result1 = (CoconEnum.ActionTypes)Enum.Parse(typeof(CoconEnum.ActionTypes), "P");
            var result2 = (CoconEnum.ActionTypes)Enum.Parse(typeof(CoconEnum.ActionTypes), "D");
            Assert.Equal(CoconEnum.ActionTypes.P, result1);
            Assert.Equal(CoconEnum.ActionTypes.D, result2);


            var getDescription1 = Utils.GetEnumDescription(result1);
            var getDescription2 = Utils.GetEnumDescription(result2);


            Assert.Equal("Patch", getDescription1);
            Assert.Equal("DePatch", getDescription2);
        }

        [Fact]
        public void Date_Time_Regex()
        {
            
        }
    }
}
