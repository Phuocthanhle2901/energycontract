using System;
using System.Collections.Generic;

namespace Cifw.Core.Logging
{
    public interface ILogger
    {
        void SetCorrelationId(string correlationId);
        string GetCorrelationId();
        void SetMessageId(string messageId);
        string GetMessageId();
        void SetAdditionalCorrelations(Dictionary<string, string> keyValues);
        Dictionary<string, string> GetAdditionalCorrelations();
        void ResetAdditionalCorrelations();
        void Info(string message);
        void Debug(string message);
        void Debug(string message, Exception exception);
        void Warn(string message);
        void Warn(string message, Exception exception);
        void Error(string message);
        void Error(string message, Exception exception);
        void Fatal(string message);
        void Fatal(string message, Exception exception);
    }
}


