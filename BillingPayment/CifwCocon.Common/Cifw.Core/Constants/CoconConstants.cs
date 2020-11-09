
using System.ComponentModel;

namespace Cifw.Core.Constants
{
    public class CoconConstants
    {
        public const string strCentralCoconFolder = "strCentralCoconFolder";
        public const string strEnvironment = "strEnvironment";
        public const string strUserName = "strUserName";
        public const string strPassword = "strPassword";
        public const string strCulture = "strCulture";
        public const string strContract = "strContract";
        public const string MsgSuccessful = "Successful";
        public const string strFieldAdministrators = "ADMINISTRATORS";
        public const string strFieldActiveOperators = "ACTIVE_OPERATORS";
        public const string strFieldAreaAdministrators = "AREA_ADMINISTRATORS";
        public const string strFieldAreaActiveOperators = "AREA_ACTIVE_OPERATORS";
       
        //0: Action Type
        //1: Port
        //2: OrderUid
        public static string EmailTemplateSendToCoConWhenWritePatchFailed = 
            @"Dear CIF WMS administrator.
                            CIF WMS was unable to write {0} label {1} to Cocon for order: {2}
                            Please correct this issue by hand.
              Kind regards,
              CIF WMS";

        public static string EmailTemplateSendForUpdateEntityRecordUpdatePayment = @"Dear CIF WMS administrator.
                            CIF WMS was Update entity to Cocon for order: {0}
                            Please correct this issue by hand.
              Kind regards,
              CIF WMS";
        public enum CleanOrderReason
        {
            /// <summary>
            /// Successfully
            /// </summary>
            [Description("Successfully")]
            None, // Not Failed
            [Description("Getting data from Cocon was failed.")]
            InvalidCoconGet,
            [Description("Checking data from Cocon was failed.")]
            InvalidCoconCheck,
            [Description("Invalid PostCode.")]
            InvalidPostCode,
            [Description("Mapping address is invalid.")]
            InvalidMappingAddress,
            [Description("Unable to process, address already has an active patch")]
            InvalidPortEquipmentEmpty,
            [Description("Unable to process, no active patch found on address")]
            InvalidPortEquipmentRequired,
            [Description("Unknown error, please contact admin to know more details")]
            GeneralError,
            [Description("Insert address was failed.")]
            InvalidInsertAddress,
            [Description("Invalid planType due to confict between CP and Cocon.")]
            InvalidPlanTypeDueToConfict,
            [Description("Can NOT insert order to database.")]
            FailedInsertToDb,
            [Description("Cocon Service does not work.")]
            InvalidCoconServiceNotAlive,
            [Description("Invalid source or destination organization.")]
            InvalidSourceDestination,
            [Description("Existed ExternalOrderUid.")]
            ExistedExternalOrderUid,
            [Description("Invalid ExternalOrderUid.")]
            InvalidExternalOrderUid,
            [Description("Invalid ServiceUid.")]
            InvaidServiceUid,
            //CIFW-917
            [Description("Invalid header.")]
            InvalidHeader,
            [Description("Invalid Item cancelled request.")]
            InvalidItemCanRequest,
            [Description("Invalid Order code type.")]
            InvalidOrderCodeType,
            [Description("ExternalOrderUid does not exist.")]
            NotExistExternalOrderUid,
            [Description("OrderUid does not exist.")]
            NotExistOrderUid,
            [Description("Not exist order code type in system.")]
            NotExistOrderCodeTypeInSystem,
            [Description("Invalid insert Contact Order type.")]
            InvalidInsertContact,
            [Description("Invalid body content of request.")]
            InvalidRequest,
            [Description("Invalid old PlanType.")]
            InvalidOldPlanType,
            [Description("There is an active deconstruction order. Please complete it first.")]
            InvalidCheckStatusDeconstruction, // CIFW-1078
            [Description("There is an active construction order.Please complete it first.")]
            InvalidCheckStatusConstruction, // CIFW-1078,
            [Description("Invalid location.")]
            InvalidLocation,
            [Description("Not exist order with the specified location in system")]
            NotExistOrderWithLocation,
            [Description("Existed OrderUid.")]
            ExistedOrderUid,
            [Description("Can't find contractorTo.")] // CIFW-1830 
            InvalidContractorTo,
            [Description("No Technical Path could be found for this order")]
            TechnicalPathNotFound,
            [Description("Adres onbekend")]
            ConstructionDataNotFound,
            [Description("BouwBestandStatus is invalid !")]
            InvalidBouwBestandStatus,
            [Description("HasDatum is null or empty !")]
            HasDateIsNullOrEmpty,
            [Description("HasDatum is invalid! HasDatum must be <= 2 weeks from today")]
            InvalidHasDate,
            [Description("HasDatum is not a datetime data!")]
            InvalidTypeHasDate,
            [Description("Apparatuurpoort is empty")]
            ApparatuurpoortIsEmpty,
            [Description("Response data from Cocon service is invalid")]
            InvalidDataFromCocon,
            [Description("Fiber is null or empty")]
            FiberIsNullOrEmpty
        }

        public enum CleanOrderFailed
        {
            [Description("Existed OrderUid.")] ExistedOrderUid,
            [Description("Construction not found in Cocon")]
            ConstructionDataNotFound,
            [Description("BouwBestandStatus {BOUWBESTANDSTATUS} is invalid !")]
            InvalidBouwBestandStatus,
            [Description("HasDatum is null or empty !")]
            HasDateIsNullOrEmpty,
            [Description("HasDatum {HASDATE} is invalid! HasDatum must be <= 2 weeks from today")]
            InvalidHasDate,
            [Description("HasDatum {HASDATE} is not a datetime data!")]
            InvalidTypeHasDate,
            [Description("Fiber is null or empty")]
            FiberIsNullOrEmpty
        }

        public enum FromNetwork
        {
            Cocon = 1,
            LocalCache = 2,
            Override = 3
        }
    }
}
