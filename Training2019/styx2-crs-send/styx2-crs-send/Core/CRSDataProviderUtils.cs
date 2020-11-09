using Common.Models;
using CRSReference;
using CRSTranformer.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace styx2_crs_send.Core
{
    public class CRSDataProviderUtils
    {
        /// <summary>
        /// Create Binding instance for Otis client service to connect.
        /// Import note that the Binding instance has to be versioned at SOAP 1.2.
        /// </summary>
        /// <returns>
        ///     Binding object for Otis Client Object to connect.
        /// </returns>
        public static System.ServiceModel.Channels.Binding GetBindingForEndpoint()
        {
            System.ServiceModel.BasicHttpBinding result = new System.ServiceModel.BasicHttpBinding();
            result.MaxBufferSize = int.MaxValue;
            result.ReaderQuotas = System.Xml.XmlDictionaryReaderQuotas.Max;
            result.MaxReceivedMessageSize = int.MaxValue;
            result.AllowCookies = true;
            result.Security.Mode = System.ServiceModel.BasicHttpSecurityMode.Transport;
            return result;

        }

        /// <summary>
        /// search one task
        /// </summary>
        /// <param name="taskSource"></param>
        /// <returns></returns>
        public static searchOneRequest SearchOneRequest(TaskModel TaskModel)
        {
            return new searchOneRequest
            {
                Ticket_Nummer = TaskModel.TicketRef
            };
        }

        /// <summary>
        /// Utility method to check if the input exception is about XML parser exception.
        /// </summary>
        /// <param name="ex">Exception to be inspected.</param>
        public static bool isXMlParserException(Exception ex)
        {
            if (ex == null) { return false; }
            if (ex is InvalidOperationException || ex.Message.Contains("There is an error in XML document")) { return true; }
            Exception innerEx = ex.InnerException;
            while (innerEx != null)
            {
                if (innerEx is InvalidOperationException || ex.Message.Contains("There is an error in XML document")) { return true; }
                innerEx = innerEx.InnerException;
            }
            return false;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="taskSource"></param>
        /// <returns></returns>
        public static Dictionary<string, string> setLogAdditional(TaskModel TaskModel, string schemaVersion, string environment)
        {
            var tags = new Dictionary<string, string>
            {
                { "Environment", environment },
                { "ActionType", "UpdateTaskByTicketRef"},
                { "SchemaVersion", schemaVersion},
                { "TicketRef", TaskModel.TicketRef},
                { "SourceId", TaskModel.SourceId},
                { "SourceSystemId", TaskModel.SourceSystemId },
                { "CreationTime", TaskModel.CreationTime.ToString()},
                { "ExternalTicketNo", TaskModel.ExternalTicketNo},
                { "RelatedIssue", TaskModel.RelatedIssue},
                { "Subject", TaskModel.Subject},
                { "UpdateCount", TaskModel.UpdateCount.ToString()},
            };
            return tags;
        }

        public static List<string> GetListMainStatus()
        {
            var listMS = new List<string>();
            listMS.Add(CommonUtils.AssignedEnum);
            listMS.Add(CommonUtils.WIPEnum);
            listMS.Add(CommonUtils.Background_FixEnum);
            listMS.Add(CommonUtils.HoldEnum);
            listMS.Add(CommonUtils.To_Be_CancelledEnum);
            listMS.Add(CommonUtils.CancelledEnum);
            listMS.Add(CommonUtils.ResolvedEnum);

            return listMS;
        }

        public static List<string> GetListDomainPermission()
        {
            var listDP = new List<string>();
            listDP.Add(CommonUtils.CityRing1V_OUTAGE);
            listDP.Add(CommonUtils.CIFAODomain);
            listDP.Add(CommonUtils.CIFAONTDomain);
            listDP.Add(CommonUtils.CIFDomain);
            listDP.Add(CommonUtils.CIFDomainCabelDamagewithoutservicedisruption);
            listDP.Add(CommonUtils.CIFDomainCabelDamagewithservicedisruption);
            listDP.Add(CommonUtils.CIFNTDomain);
            listDP.Add(CommonUtils.CityRing1V_MUTED);
            listDP.Add(CommonUtils.CityRingGT1V_MUTED);
            listDP.Add(CommonUtils.CityRingGT1V_OUTAGE);
            listDP.Add(CommonUtils.FTUmove);

            return listDP;
        }

        public static List<string> GetListPlanPeriodsType()
        {
            var list = new List<string>();
            list.Add(CommonEnum.PlanPeriodsType.AFTERNOON.ToString());
            list.Add(CommonEnum.PlanPeriodsType.EARLY_AFTERNOON.ToString());
            list.Add(CommonEnum.PlanPeriodsType.EARLY_MORNING.ToString());
            list.Add(CommonEnum.PlanPeriodsType.EOB.ToString());
            list.Add(CommonEnum.PlanPeriodsType.EVENING.ToString());
            list.Add(CommonEnum.PlanPeriodsType.LATE_AFTERNOON.ToString());
            list.Add(CommonEnum.PlanPeriodsType.LATE_MORNING.ToString());
            list.Add(CommonEnum.PlanPeriodsType.MORNING.ToString());
            list.Add(CommonEnum.PlanPeriodsType.NIGHT.ToString());

            return list;
        }

        public static List<string> GetListDepartment()
        {
            var list = new List<string>();
            list.Add(CommonEnum.Department.BEHEERDER.ToString());
            list.Add(CommonEnum.Department.NOC.ToString());
            list.Add(CommonEnum.Department.SERVICE_DESK.ToString());

            return list;
        }

        public static List<string> GetListNetworkType()
        {
            var list = new List<string>();
            list.Add(CommonEnum.NetworkType.COAX.ToString());
            list.Add(CommonEnum.NetworkType.FttH.ToString());
            list.Add(CommonEnum.NetworkType.FttO.ToString());
            list.Add(CommonEnum.NetworkType.FttS.ToString());
            list.Add(CommonEnum.NetworkType.PtP.ToString());

            return list;
        }

        public static List<string> GetListFiberCode()
        {
            var list = new List<string>();
            list.Add(CommonEnum.FiberCode.FIBER_A.ToString());
            list.Add(CommonEnum.FiberCode.FIBER_B.ToString());

            return list;
        }

        public static string TranformerStatus(string status)
        {
            switch (status)
            {
                case CommonUtils.Assigned:
                    return CommonUtils.AssignedEnum;
                case CommonUtils.WIP:
                    return CommonUtils.WIPEnum;
                case CommonUtils.Hold:
                    return CommonUtils.HoldEnum;
                case CommonUtils.Background_Fix:
                    return CommonUtils.Background_FixEnum;
                case CommonUtils.To_Be_Cancelled:
                    return CommonUtils.To_Be_CancelledEnum;
                case CommonUtils.Cancel_Effective:
                    return $"{CommonUtils.CancelledEnum}({CommonUtils.CancelOkEnum})"; 
                case CommonUtils.Cancel_Expired:
                    return $"{CommonUtils.CancelledEnum}({CommonUtils.CancelExpiredEnum})";
                case CommonUtils.Resolved:
                    return CommonUtils.ResolvedEnum;
                case CommonUtils.Resolved_TemporaryFix:
                    return $"{CommonUtils.ResolvedEnum}({CommonUtils.TemporaryFixEnum})";
                default:
                    return "";
            }
        }
    }
}
