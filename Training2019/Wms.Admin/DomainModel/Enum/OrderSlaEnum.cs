using System.ComponentModel;
using System.Runtime.Serialization;

namespace DomainModel.Enum
{
    public class OrderSlaEnum
    {
        public enum Priority
        {
            BASIC,
            PREMIUM
        }

        public enum OrderType
        {
            construction,
            deconstruction,
            aftercare
        }

        public enum NLType
        {
            NL6,
            NL7,
            NL8,
            NL9,
            NL10,
            xTL,
            NA
        }
        public enum NetworkType
        {
            FIBER = 1,
            COAX = 2,
            HYBRID = 3,
            FttH = 4,
            FttO = 5,
            FttS = 6,
            PtP = 7
        }

        public enum FiberStatus
        {
            GL,
            GV,
            MTK,
            SLAG,
            WNK,
            EG,
            IDP,
            KLDR,
            PASS,
            SMK,
            SWON,
            UNDET,
        }

        public enum MeasurementUnit
        {
            Workingdays,
            Clockhours,
            Servicehours
        }

        public enum RuleType
        {
            Reactiesnelheid,
            Oplostijd
        }

        public enum Domain
        {
            Assurance,
            Fulfillment
        }

        public enum SlaDirection
        {
            huurder_wms,
            wms_beheerder
        }

        public enum DataTypeRule
        {
            [Description("string")]
            STRING,
            [Description("interger")]
            INTERGER,
            [Description("long")]
            LONG,
            [Description("datetime")]
            DATETIME,

        }

        public enum CalendarType
        {
            [EnumMember(Value = "Werkdagen")]
            Werkdagen = 1,
            [EnumMember(Value = "7 x 24 x 365")]
            WorkAlways = 2
        }
        public enum CommentTypeSla
        {
            [Description("0")]
            typeOne,
            [Description("3 - woning staat leeg")]
            woninglstaatleeg,
            [Description("3 - Geen toestemming eigenaar van het pand")]
            Geentoestemming,
            [Description("3 - geen toestemming(semi) overheid / gemeentelijke instelling")]
            Semi,
            [Description("3 - geen toegang afhankelijk van andere woning")]
            Geentoegangafhankelijk,
            [Description("8 - bewoner na x keer niet thuis")]
            Bewoner,
            [Description("3- woning / adres is nieuwbouw")]
            Nieuwbouw


        }


        // Enum SlaEnum Validation Messages
        public enum ValidationMessage
        {
            [Description("Fout bij het downloaden van bestanden van de server of gegevens reactie leeg, dan kunt u bekijken logbestand")]
            ErrorDownload,
            [Description("System error: please contact the administrator!")]
            SystemError,
        }

        public enum Direction
        {
            DESC,
            ASC
        }
        public enum Search
        {
            organization,
            slaType,
            action,
            sla,
            slaRuleNr,
            constructionStatus,
            connectionStatus,
            nlType,
            priority,
            ruleType,
            threshold,
            measurementUnit,
            start,
            end,
            calendar,
            networkType,
            createdDate,
            updatedDate
        }
    }
}
