using IFD.Logging.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace CifwCocon.NetworkInformation.Bo
{
    public enum BusinessLogicLoggingEnum
    {
        [LogAttribute("Request NIM sucessful", "BUL-0002", LogLevel.Info)]
        BUL0002,
        [LogAttribute("Request Notification Api failed", "BUL-0042", LogLevel.Warn)]
        BUL0042
    }
}
