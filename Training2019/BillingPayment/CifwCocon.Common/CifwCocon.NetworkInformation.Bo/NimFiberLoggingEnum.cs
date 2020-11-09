using IFD.Logging.Model;

namespace CifwCocon.NetworkInformation.Bo
{
    public enum NimFiberLoggingEnum
    {
        [LogAttribute("Model is invalid NetworkInfomation In Api", "NFI-0001", LogLevel.Warn)]
        NFI0001,
        [LogAttribute("Result is null from Biz CleanNetworkInfomation In Api", "NFI-0002", LogLevel.Warn)]
        NFI0002,
        [LogAttribute("Get network information failed", "NFI-0003", LogLevel.Error)]
        NFI0003,
        [LogAttribute("Request Model is null Change Port In Api", "NFI-0004", LogLevel.Warn)]
        NFI0004,
        [LogAttribute("Get network from Override(Redis) failed", "NFI-0005", LogLevel.Error)]
        NFI0005,
        [LogAttribute("Get network information successfully In Biz", "NFI-0006", LogLevel.Info)]
        NFI0006,
        [LogAttribute("Get network from Cocon(SpeerIT) is failed", "NFI-0007", LogLevel.Error)]
        NFI0007,
        [LogAttribute("Begin Change Port In Api", "NFI-0008", LogLevel.Info)]
        NFI0008,
        [LogAttribute("End Change Port In Api", "NFI-0009", LogLevel.Info)]
        NFI0009,
        [LogAttribute("Begin Clean NetworkInfomation In Api", "NFI-0010", LogLevel.Info)]
        NFI0010,
        [LogAttribute("End Clean NetworkInfomation In Api", "NFI-0011", LogLevel.Info)]
        NFI0011,
        [LogAttribute("Call Biz CleanNetWorkInfomation In Api", "NFI-0012", LogLevel.Info)]
        NFI0012,
        [LogAttribute("Begin Change Port In Biz Handle", "NFI-0013", LogLevel.Info)]
        NFI0013,
        [LogAttribute("End Change Port In Biz Handle", "NFI-0014", LogLevel.Info)]
        NFI0014,
        [LogAttribute("Begin Publish Event Change Port In Biz Handle", "NFI-0015", LogLevel.Info)]
        NFI0015,
        [LogAttribute("End Publish Event Change Port In Biz Handle", "NFI-0016", LogLevel.Info)]
        NFI0016,
        [LogAttribute("Get network from Override first", "NFI-0017", LogLevel.Info)]
        NFI0017,
        [LogAttribute("Begin Clean NetworkInfomation In Biz Handle", "NFI-0018", LogLevel.Info)]
        NFI0018,
        [LogAttribute("--- SWITCH TO LOCAL CACHE ---", "NFI-0019", LogLevel.Info)]
        NFI0019,
        [LogAttribute("Get Response From Real Cocon Clean NetworkInfomation In Biz Handle", "NFI-0020", LogLevel.Info)]
        NFI0020,
        [LogAttribute("--- RAISE UpdateLocalCacheByCleanIntegrationEvent event TO LOCAL CACHE ---", "NFI-0021", LogLevel.Info)]
        NFI0021,
        [LogAttribute("Response clean FiberA", "NFI-0022", LogLevel.Info)]
        NFI0022,
        [LogAttribute("Response clean FiberB", "NFI-0023", LogLevel.Info)]
        NFI0023,
        [LogAttribute("End Clean NetworkInfomation In Biz", "NFI-0024", LogLevel.Info)]
        NFI0024,
        [LogAttribute("Begin Read Entity In Biz", "NFI-0025", LogLevel.Info)]
        NFI0025,
        [LogAttribute("Getting network information successfully In Biz", "NFI-0026", LogLevel.Info)]
        NFI0026,
        [LogAttribute("Raise event to re-update technical path", "NFI-0027", LogLevel.Info)]
        NFI0027,
        [LogAttribute("Job start write (de)patch", "NFI-0028", LogLevel.Info)]
        NFI0028,
        [LogAttribute("Job write (de)patch finish successfully RAISE UpdateLocalCacheByPatchIntegrationEvent event to update LOCAL CACHE - Info address", "NFI-0029", LogLevel.Info)]
        NFI0029,        
        [LogAttribute("Handle WritePatchIntegrationEventHandler failed", "NFI-0031", LogLevel.Warn)]
        NFI0031,
        [LogAttribute("Login Cocon to write (de)patch", "NFI-0032", LogLevel.Info)]
        NFI0032,
        [LogAttribute("Change port Cocon to write (de)patch", "NFI-0033", LogLevel.Info)]
        NFI0033,
        [LogAttribute("Log out", "NFI-0034", LogLevel.Info)]
        NFI0034,
        [LogAttribute("Get network from LocalCache failed", "NFI-0035", LogLevel.Error)]
        NFI0035
    }
}
