using System;
using IFD.Logging.Model;

namespace Common
{
    public class ClientException : Exception, IHandleMessageCode
    {
        public int? Code { get; set; }
        public ClientException(string message) : base(message)
        {
        }
        public ClientException(string message, Exception inner) : base(message, inner)
        {
        }
        public ClientException(Enum loggingEnum, string message = null, Exception inner = null) : base(message, inner)
        {
            LogObject = loggingEnum;
            OverrideMessage = message;
        }
        public ClientException(Enum loggingEnum, int code, string message = null) : base(message)
        {
            LogObject = loggingEnum;
            OverrideMessage = message;
            Code = code != 0 ? code : (int?)null;
        }
        public ClientException(Enum loggingEnum)
        {
            LogObject = loggingEnum;
        }
        public ClientException(Enum loggingEnum, string message = null) : base(message)
        {
            LogObject = loggingEnum;
            OverrideMessage = message;
        }

        public Enum LogObject { get; set; }
        public string OverrideMessage { get; set; }
    }
}
