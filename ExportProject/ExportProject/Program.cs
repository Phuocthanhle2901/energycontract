using Entites.Models;
using System;
using System.IO;
using Services;
using UnitOfWorks;
using System.Collections.Generic;
using Renci.SshNet;
using log4net;
using System.Reflection;
using log4net.Config;
using System.Web;
namespace ExportProject
{
    class Program
    {
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        static void Main(string[] args)
        {
            //var logRepository = LogManager.GetRepository(Assembly.GetEntryAssembly());
            //XmlConfigurator.Configure(logRepository, new FileInfo("log4net.config"));
            //var logger = LogManager.GetLogger(typeof(Program));
            Log4netconfig log4Netconfig = new Log4netconfig();
            ILog logger = log4Netconfig.log4net();
            Console.WriteLine("Start exports csv file...");
            logger.Info("Start exports csv file...");
            JobExportUnitRepository Unit = new JobExportUnitRepository();
            JobExportRepositoryService Service = new JobExportRepositoryService();
            IEnumerable<Stores> emps = Unit.LoadAllData();
            string dir = Service.ExportToCSVFile(emps);
            Console.WriteLine("File have been exported to CSV!");
            logger.Info("File have been exported to CSV!");
            Console.WriteLine("Connecting to sftp Server...");
            logger.Info("Connecting to sftp Server...");
            SFTP sftp = new SFTP();
            //string ip;
            //string name;
            //string password;
            //Console.Write("Please enter the server ip: ");
            //ip = Console.ReadLine();
            //Console.Write("Account name              : ");
            //name = Console.ReadLine();
            //Console.Write("Password                  : ");
            //password = Console.ReadLine();
            bool result = sftp.connectSftpServer("192.168.2.75", 22, "Interns", "123456", 120);
            if (result)
            {
                Console.WriteLine("Connect successfully!!!");
                logger.Info("Connect successfully!!!");
            }
            else
            {
                Console.WriteLine("Connect failed!!!");
                logger.Error("Connect failed!!!");
                Console.ReadKey();
                return;
            }
            String[] arrayFullFileName = dir.Split('\\');
            String strFileName = arrayFullFileName[arrayFullFileName.Length - 1];
            Console.WriteLine("transfering File...");
            logger.Info("transfering File...");
            if (sftp.UploadFileToSftp(dir, "\\desktop\\" + strFileName, true))
            {
                Console.WriteLine("Tranfer successfully!!!");
                logger.Info("Tranfer successfully!!!");
                Unit.Dispose();
            }
            //else Console.WriteLine("File can not be transfered!");
          
            Console.ReadKey();
        }
    }
}
