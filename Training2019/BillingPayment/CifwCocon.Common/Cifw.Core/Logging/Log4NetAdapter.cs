using System;
using System.IO;
using System.Reflection;
using log4net;
using log4net.Config;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

namespace Cifw.Core.Logging
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
            _log = LogManager.GetLogger(logRepository.Name, "CoconNetwork");
        }

        /// <summary>
        ///     Initializes a new instance of the <see cref="Log4NetAdapter" /> class.
        /// </summary>
        public Log4NetAdapter(IConfiguration configuration)
        {

            var logRepository = LogManager.CreateRepository(Assembly.GetEntryAssembly(), typeof(log4net.Repository.Hierarchy.Hierarchy));
         
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

        public void Debug(string message, Exception exception)
        {
            _log.Debug(message, exception);
        }

        public string GetCorrelationId()
        {
            return ThreadContext.Properties["X-Request-ID"] != null ? ThreadContext.Properties["X-Request-ID"].ToString() : null;
        }

        public void SetCorrelationId(string correlationId)
        {
            ThreadContext.Properties["X-Request-ID"] = correlationId;
        }

        public string GetMessageId()
        {
            return ThreadContext.Properties["X-Message-ID"] != null ? ThreadContext.Properties["X-Message-ID"].ToString() : null;
        }

        public void SetMessageId(string messageId)
        {
            ThreadContext.Properties["X-Message-ID"] = messageId;
        }

        public void SetAdditionalCorrelations(Dictionary<string, string> keyValues)
        {
            if (keyValues == null || keyValues.Count == 0)
            {
                return;
            }

            var correlationId = ThreadContext.Properties["X-Request-ID"];
            var messageId = ThreadContext.Properties["X-Message-ID"];
            ThreadContext.Properties.Clear();


            foreach (KeyValuePair<string, string> entry in keyValues)
            {
                ThreadContext.Properties[entry.Key] = entry.Value;
            }

            ThreadContext.Properties["X-Request-ID"] = correlationId;
            ThreadContext.Properties["X-Message-ID"] = messageId;
        }

        public Dictionary<string, string> GetAdditionalCorrelations()
        {
            var keys = ThreadContext.Properties.GetKeys();
            if (keys != null && keys.Length > 0)
            {
                var rs = new Dictionary<string, string>();
                for (var i = 0; i < keys.Length; i++)
                {
                    try{ rs.Add(keys[i], ThreadContext.Properties[keys[i]].ToString()); } catch { }
                }
                return rs;
            }
            return null;
        }

        public void ResetAdditionalCorrelations()
        {
            try
            {
                ThreadContext.Properties.Clear();
            }
            catch
            {

            }
        }
    }
}
