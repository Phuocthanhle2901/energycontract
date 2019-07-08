using log4net;
using log4net.Config;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;

namespace ExportProject
{
    class Log4netconfig
    {
        public ILog log4net()
        {
            var logRepository = LogManager.GetRepository(Assembly.GetEntryAssembly());

            XmlConfigurator.Configure(logRepository, new FileInfo("log4net.config"));

            var logger = LogManager.GetLogger(typeof(Program));
            return logger;
        }
    }
}
