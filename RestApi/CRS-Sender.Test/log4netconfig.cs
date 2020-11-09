using log4net;
using log4net.Config;
using System.IO;
using System.Reflection;
namespace ExportProject
{
    class Log4netConfig
    {
        public ILog Log4net()
        {
            var logRepository = LogManager.GetRepository(Assembly.GetEntryAssembly());
            XmlConfigurator.Configure(logRepository, new FileInfo("log4net.config"));
            var logger = LogManager.GetLogger(typeof(Program));
            return logger;
        }
    }
}
