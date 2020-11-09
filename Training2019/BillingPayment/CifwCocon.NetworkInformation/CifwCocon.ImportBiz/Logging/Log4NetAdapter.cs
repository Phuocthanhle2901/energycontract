using System;
using System.IO;
using System.Reflection;
using log4net;
using log4net.Config;
using Microsoft.Extensions.Configuration;

namespace CifwCocon.ImportBiz.Logging
{
    public class Log4NetAdapter : ILogger
    {
        private readonly ILog _log;
        private const string MessageExceptionWithInner = "Occurred an error with Messagecode \"{0}\", Text \"{1}\"" +
                        "\nType: {2}" +
                        "\nInner exception: {3}" +
                        "\nStack trace:\n{4}";
        private const string MessageExceptionWithoutInner = "Occurred an error with Messagecode \"{0}\", Text \"{1}\"" +
                        "\nType: {2}" +
                        "\nStack trace:\n{3}";

        public Log4NetAdapter()
        {
            var logRepository = LogManager.GetRepository(Assembly.GetEntryAssembly());
            XmlConfigurator.Configure(logRepository, new FileInfo("log4net.config"));
            _log = LogManager.GetLogger(logRepository.Name, "CoconImport");
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="Log4NetAdapter" /> class.
        /// </summary>
        public Log4NetAdapter(IConfiguration configuration)
        {
            var logRepository = LogManager.GetRepository(Assembly.GetEntryAssembly());
            XmlConfigurator.Configure(logRepository, new FileInfo("log4net.config"));
            _log = LogManager.GetLogger(logRepository.Name, configuration["LoggerName"]);
        }

        /// <summary>
        ///     Logs the specified message.
        /// </summary>
        /// <param name="message">The message.</param>
        public void Info(string message)
        {
            _log.Info(message);
        }

        public void Debug(string message)
        {
            _log.Debug(message);
        }

        public void Warn(string message)
        {
            _log.Warn(message);
        }

        public void Warn(string message, Exception exception)
        {
            _log.Warn(message, exception);
        }

        public void Error(string message)
        {
            _log.Error(message);
        }

        public void Error(string message, Exception exception)
        {
            _log.Error(message, exception);
        }

        public void Fatal(string message)
        {
            _log.Warn(message);
        }

        public void Fatal(string message, Exception exception)
        {
            _log.Warn(message, exception);
        }
    }
}
