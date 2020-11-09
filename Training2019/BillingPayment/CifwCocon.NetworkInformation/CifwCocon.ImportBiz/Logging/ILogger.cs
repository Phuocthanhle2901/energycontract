using System;

namespace CifwCocon.ImportBiz.Logging
{
    public interface ILogger
    {
        void Info(string message);
        void Debug(string message);
        void Warn(string message);
        void Warn(string message, Exception exception);
        void Error(string message);
        void Error(string message, Exception exception);
        void Fatal(string message);
        void Fatal(string message, Exception exception);
    }
}
