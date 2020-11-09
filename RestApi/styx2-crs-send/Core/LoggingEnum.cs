using IFD.Logging.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace styx2_crs_send.Core
{
    public enum LoggingEnum
    {
        [Log("Begin request.", "SCS-0001", LogLevel.Info)]
        SCS0001,
        [Log("End request.", "SCS-0002", LogLevel.Info)]
        SCS0002,
        [Log("Update ticket successfully.", "SCS-0003", LogLevel.Info)]
        SCS0003,
        [Log("Update ticket failed.", "SCS-0004", LogLevel.Warn)]
        SCS0004,
        [Log("Can't update ticket because TaskSource is null.", "SCS-0005", LogLevel.Warn)]
        SCS0005,
        [Log("Clean request failed.", "SCS-0006", LogLevel.Warn)]
        SCS0006,
        [Log("The message already had status.", "SCS-0007", LogLevel.Warn)]
        SCS0007,

        [Log("Can't get result from CRS.", "SCS-0010", LogLevel.Warn)]
        SCS0010,
        [Log("Request to CRS service with no result.", "SCS-0011", LogLevel.Warn)]
        SCS0011,
        [Log("Failed to connect to CRS caused by invalid endpoint or connection reset.", "SCS-0012", LogLevel.Warn)]
        SCS0012,
        [Log("Reached retry limit when fetched detail of ticket.", "SCS-0013", LogLevel.Warn)]
        SCS0013,

        [Log("Unknown error.", "SCS-9999", LogLevel.Error)]
        SCS9999,
    }
}
