using IFD.Logging.Model;

namespace Common
{
    public enum LoggingEnum
    {
        [Log("Uknown error", "UDR-9999", LogLevel.Warn)]
        UDR9999,
        [Log("Get unrouted orders successfully ", "UDR-0001", LogLevel.Info)]
        UDR0001,
        [LogAttribute("Invalid data", "UDR-0002", LogLevel.Error)]
        UDR0002,
        [LogAttribute("Get beheerder successfully ", "UDR-0004", LogLevel.Info)]
        UDR0004,
        [LogAttribute("Unknown error", "UDR-0005", LogLevel.Error)]
        UDR0005,
        [LogAttribute("Update beheerder for unrouted order successfully", "UDR-0007", LogLevel.Info)]
        UDR0007,
        [LogAttribute("Update beheerder for unrouted order failed", "UDR-0008", LogLevel.Error)]
        UDR0008,
        [LogAttribute("Request Flowmanager Api sucessfully", "UDR-0009", LogLevel.Info)]
        UDR0009,
        [LogAttribute("Request Flowmanager Api failed", "UDR-0010", LogLevel.Error)]
        UDR0010,
        ///SlaRule
        [LogAttribute("Insert order SlaRule successfully", "UDR-0011", LogLevel.Info)]
        UDR0011,
        [LogAttribute("Insert order SlaRule failed", "UDR-0012", LogLevel.Warn)]
        UDR0012,
        [LogAttribute("Update order SlaRule successfully", "UDR-0013", LogLevel.Info)]
        UDR0013,
        [LogAttribute("Update order SlaRule failed", "UDR-0014", LogLevel.Warn)]
        UDR0014,
        [LogAttribute("Get list order SlaRule successfully", "UDR-0015", LogLevel.Info)]
        UDR0015,
        [LogAttribute("Get list order SlaRule failed", "UDR-0016", LogLevel.Warn)]
        UDR0016,
        //Routing
        [LogAttribute("Insert order Routing successfully", "UDR-0017", LogLevel.Info)]
        UDR0017,
        [LogAttribute("Insert order Routing failed", "UDR-0018", LogLevel.Warn)]
        UDR0018,
        [LogAttribute("Update order Routing successfully", "UDR-0019", LogLevel.Info)]
        UDR0019,
        [LogAttribute("Update order Routing failed", "UDR-0020", LogLevel.Warn)]
        UDR0020,
        [LogAttribute("Delete order Routing successfully", "UDR-0021", LogLevel.Info)]
        UDR0021,
        [LogAttribute("Delete order Routing failed", "UDR-0022", LogLevel.Warn)]
        UDR0022,
        [LogAttribute("Order Routing Not found", "UDR-0023", LogLevel.Warn)]
        UDR0023,
        [LogAttribute("Request to Beheerder API failed", "UDR-0024", LogLevel.Error)]
        UDR0024,
        [LogAttribute("Request to Coax API failed", "UDR-0025", LogLevel.Error)]
        UDR0025,
        [LogAttribute("Request to Huurder API failed", "UDR-0026", LogLevel.Error)]
        UDR0026,
        [LogAttribute("Invalid field organization data", "UDR-0027", LogLevel.Error)]
        UDR0027,
        [LogAttribute("Get order by externalOrdeUid or OrderUid successfully", "UDR-0028", LogLevel.Info)]
        UDR0028,
        [LogAttribute("Get info cocon_mapping successfully", "UDR-0029", LogLevel.Info)]
        UDR0029,
        [LogAttribute("Updated cocon_mapping successfully!", "UDR-0030", LogLevel.Info)]
        UDR0030,
        [LogAttribute("Updated cocon_mapping failed!. Please contact to administrator ", "UDR-0031", LogLevel.Warn)]
        UDR0031,
        [LogAttribute("Delete cocon_mapping successfully!", "UDR-0032", LogLevel.Info)]
        UDR0032,
        [LogAttribute("Delete cocon_mapping failed!. Please contact to administrator ", "UDR-0033", LogLevel.Warn)]
        UDR0033,
        [LogAttribute("Get Party Huurder and Beheerder to get wmsName for cocon_mapping", "UDR-0034", LogLevel.Info)]
        UDR0034,
        [LogAttribute("Get info cocon_mapping by id successfully! ", "UDR-0035", LogLevel.Info)]
        UDR0035,
        [LogAttribute("Inserted cocon_mapping successfully!", "UDR-0036", LogLevel.Info)]
        UDR0036,
        [LogAttribute("Update ternimated orders failed. Please contact to administrator", "UDR-0037", LogLevel.Warn)]
        UDR0037,

    }
}
