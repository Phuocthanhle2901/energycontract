using Entites.Models;
using log4net;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Services;
using System;
using System.Collections.Generic;
using UnitOfWorks;
using Microsoft.EntityFrameworkCore;
namespace ExportProject
{
    class Program
    {
        private static IConfiguration Configuration { get; set; }
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        static void Main(string[] args)
        {
            var serviceCollection = new ServiceCollection();
            ConfigureServices(serviceCollection);
            var serviceProvider = serviceCollection.BuildServiceProvider();
            var serviceExport = serviceProvider.GetService<IJobExportService>();
            var unitExport = serviceProvider.GetService<IJobExportUnit>();
            var Sftp = serviceProvider.GetService<ISftp>();
            ReadFileJson json = new ReadFileJson();
            Log4netConfig log4Netconfig = new Log4netConfig();
            ILog logger = log4Netconfig.Log4net();
            logger.Info("Start exports csv file...");
            //JobExportRepositoryService Service = new JobExportRepositoryService();
            IEnumerable<ViewExport> emps = unitExport.LoadAllData();
            string dir = serviceExport.ExportToCSVFile(emps, json.fileName);
            logger.Info("File have been exported to CSV!");
            logger.Info("Connecting to sftp Server...");

            bool result = Sftp.connectSftpServer(json.host, 22, json.name, json.password, 120);
            if (result)
            {
                logger.Info("Connect successfully!!!");
            }
            else
            {
                logger.Error("Connect failed!!!");
                Console.ReadKey();
                return;
            }
            String[] arrayFullFileName = dir.Split('\\');
            String strFileName = arrayFullFileName[arrayFullFileName.Length - 1];
            logger.Info("transfering File...");
            if (Sftp.UploadFileToSftp(json.strSource, json.strDesPath, strFileName, true))
            {
                logger.Info("Tranfer successfully!!!");
                unitExport.Dispose();
            }
            //else Console.WriteLine("File can not be transfered!");
            Console.ReadKey();
        }
        private static void ConfigureServices(IServiceCollection serviceCollection)
        {
            ReadFileJson json = new ReadFileJson();
            serviceCollection.AddSingleton(s => Configuration);
            serviceCollection.AddTransient<IJobExportService, JobExportRepositoryService>();
            serviceCollection.AddTransient<IJobExportUnit, JobExportUnitRepository>();
            serviceCollection.AddTransient<ISftp, Sftp>();
            serviceCollection.AddDbContext<ExportProjectContext>(
              options =>
              options.UseMySQL(json.connectionString), ServiceLifetime.Transient, ServiceLifetime.Transient
            ).AddUnitOfWork<ExportProjectContext>();
        }
    }
}
