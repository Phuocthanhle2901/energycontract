using Common.Exceptions;
using Common.Models;
using CRSReference;
using CRSTranformer.Utils;
using Microsoft.Extensions.Configuration;
using styx2_crs_send.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace styx2_crs_send.Handle
{
    public interface ICheckRequest
    {
        void CheckSource(TaskModel TaskModel);
        bool CheckEnumStatus(string mainStatus, string subStatus);
        bool CheckValue(string value, string field, List<string> listValue);
        bool CheckInputStatusForUpdateFields(TaskModel TaskModel);
        bool checkStatusBeforeUpdate(TsearchOneResult searchOneResponse, TaskModel TaskModel);
    }
    public class CheckRequest : ICheckRequest
    {
        private readonly IConfiguration _configuration;
        public CheckRequest(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// check required field
        /// </summary>
        /// <param name="TaskModel"></param>
        public void CheckSource(TaskModel TaskModel)
        {
            TaskModel.SourceId = TaskModel.SourceId?.Trim() ?? _configuration["SourceId"];
            TaskModel.SourceSystemId = TaskModel.SourceSystemId?.Trim() ?? _configuration["SourceSystemId"];
            if (!TaskModel.SourceId.Equals(_configuration["SourceId"]) || !TaskModel.SourceSystemId.Equals(_configuration["SourceSystemId"]))
            {
                throw new HandleFailedException(LoggingEnum.SCS0006, $"Source({TaskModel.SourceId}/{TaskModel.SourceSystemId}) is invalid.");
            }
            
            if(TaskModel.Planned == null 
                || (TaskModel.Planned.From == DateTime.MinValue && TaskModel.Planned.Till == DateTime.MinValue 
                && string.IsNullOrWhiteSpace(TaskModel.Planned.Period) && TaskModel.Planned.Time == null))
            {
                throw new HandleFailedException(LoggingEnum.SCS0006, $"Planned is required");
            }

            if(TaskModel.Prio3 == null)
            {
                throw new HandleFailedException(LoggingEnum.SCS0006, $"Prio3 is required");
            }
            else if(!TaskModel.Prio3.Priority.Equals("3"))
            {
                throw new HandleFailedException(LoggingEnum.SCS0006, $"Priority({TaskModel.Prio3.Priority}) is invalid");
            }

            if(TaskModel.Prio3.Comment == null || TaskModel.Prio3.Comment.Count < 1)
            {
                throw new HandleFailedException(LoggingEnum.SCS0006, $"Comment is required");
            }
        }

        /// <summary>
        /// check input MainStatus and SubStatus
        /// </summary>
        /// <param name="mainStatus"></param>
        /// <param name="subStatus"></param>
        /// <returns></returns>
        public bool CheckEnumStatus(string mainStatus, string subStatus)
        {
            var listMS = CRSDataProviderUtils.GetListMainStatus();
            var listMain = "";
            foreach(var ms in listMS)
            {
                listMain += $"\n - {ms}";
            }

            if (!string.IsNullOrWhiteSpace(mainStatus))
            {
                if (!listMS.Contains(mainStatus))
                {
                    throw new HandleFailedException(LoggingEnum.SCS0006, $"MainStatus({mainStatus}) is invalid, please input one of these MainStatus {listMain}");
                }
                else
                {
                    if (mainStatus.Equals(CommonUtils.CancelledEnum))
                    {
                        if(subStatus != CommonUtils.CancelOkEnum && subStatus != CommonUtils.CancelExpiredEnum && !string.IsNullOrWhiteSpace(subStatus))
                        {
                            throw new HandleFailedException(LoggingEnum.SCS0006, $"SubStatus({ subStatus }) is invalid, please input SubStatus '{CommonUtils.CancelOkEnum}', '{CommonUtils.CancelExpiredEnum}' or none SubStatus.");
                        }
                    }
                    else if (mainStatus.Equals(CommonUtils.ResolvedEnum))
                    {
                        if(subStatus != CommonUtils.TemporaryFixEnum && !string.IsNullOrWhiteSpace(subStatus))
                        {
                            throw new HandleFailedException(LoggingEnum.SCS0006, $"SubStatus({ subStatus }) is invalid, please input SubStatus '{CommonUtils.TemporaryFixEnum}' or none SubStatus.");
                        }
                    }
                    else
                    {
                        if (!string.IsNullOrWhiteSpace(subStatus))
                        {
                            throw new HandleFailedException(LoggingEnum.SCS0006, $"The MainStatus({mainStatus}) don't have SubStatus");
                        }
                    }
                }
            }
            return true;
        }

        /// <summary>
        /// check contains value of list value
        /// </summary>
        /// <param name="value"></param>
        /// <param name="field"></param>
        /// <param name="listValue"></param>
        /// <returns></returns>
        public bool CheckValue(string value, string field, List<string> listValue)
        {
            var message = "";
            foreach (var vl in listValue)
            {
                message += $"\n - {vl}";
            }

            if (!string.IsNullOrWhiteSpace(value))
            {
                if (!listValue.Contains(value))
                {
                    throw new HandleFailedException(LoggingEnum.SCS0006, $"{field}({value}) is invalid, please input one of these {field} {message}");
                }
            }
            return true;
        }

        /// <summary>
        /// check input status for update Closure and StatusCode
        /// </summary>
        /// <param name="TaskModel"></param>
        /// <returns></returns>
        public bool CheckInputStatusForUpdateFields(TaskModel TaskModel)
        {
            var mainStatus = TaskModel.Status.MainStatus;
            var subStatus = TaskModel.Status.SubStatus;
            //Check input status for update Closure
            if(TaskModel.Prio3.Closure != null)
            {
                if (mainStatus.Equals(CommonUtils.ResolvedEnum))
                {
                    if (subStatus == CommonUtils.TemporaryFixEnum)
                        throw new HandleFailedException(LoggingEnum.SCS0006, $"Status is not RESOLVED, that can't update Closure");
                }
                else
                    throw new HandleFailedException(LoggingEnum.SCS0006, $"Status is not RESOLVED, that can't update Closure");
            }

            //Check input status for update Status code
            if ((!string.IsNullOrWhiteSpace(TaskModel.StatusCode?.Code)) || (!string.IsNullOrWhiteSpace(TaskModel.StatusCode?.Text)))
            {
                if (mainStatus.Equals(CommonUtils.ResolvedEnum))
                {
                    if (subStatus == CommonUtils.TemporaryFixEnum)
                        return true;
                }
                else if (mainStatus.Equals(CommonUtils.WIPEnum) || mainStatus.Equals(CommonUtils.HoldEnum) || mainStatus.Equals(CommonUtils.Background_FixEnum))
                    return true;

                throw new HandleFailedException(LoggingEnum.SCS0006, $"Can't update StatusCode with MainStatus({mainStatus}) and SubStatus({subStatus})");
            }
            return true;
        }

        /// <summary>
        /// Check status of ticket before update
        /// </summary>
        /// <param name="searchOneResponse"></param>
        /// <param name="TaskModel"></param>
        /// <returns></returns>
        public bool checkStatusBeforeUpdate(TsearchOneResult searchOneResponse, TaskModel TaskModel)
        {
            var wFM_Status = searchOneResponse.WFM_Status;
            var mainStatus = TaskModel.Status.MainStatus;
            var subStatus = TaskModel.Status.SubStatus;
            var exMessage = $"Can't update ticket {TaskModel.TicketRef} with MainStatus({mainStatus}) and SubStatus({subStatus}) because this ticket already had status '{wFM_Status}', ";
            
            bool check = false;
            if (string.IsNullOrWhiteSpace(mainStatus)) { }
            else
            {
                if (wFM_Status.Equals(CommonUtils.Cancel_Effective) || wFM_Status.Equals(CommonUtils.Cancel_Expired) || wFM_Status.Equals(CommonUtils.Resolved))
                {
                    exMessage += $"ticket is closed.";
                    check = true;
                }

                if (wFM_Status.Equals(CommonUtils.Assigned))
                {
                    if (!mainStatus.Equals(CommonUtils.WIPEnum) && !mainStatus.Equals(CommonUtils.AssignedEnum))
                    {
                        exMessage += $"you can update status '{CRSDataProviderUtils.TranformerStatus(CommonUtils.WIP)}'";
                        check = true;
                    }
                }

                if (wFM_Status.Equals(CommonUtils.To_Be_Cancelled))
                {
                    exMessage += $"you can update status '{CRSDataProviderUtils.TranformerStatus(CommonUtils.Cancel_Effective)}' or '{CRSDataProviderUtils.TranformerStatus(CommonUtils.Cancel_Expired)}'.\nNote: The value in parentheses is SubStatus.";
                    if (!mainStatus.Equals(CommonUtils.CancelledEnum) && !mainStatus.Equals(CommonUtils.To_Be_CancelledEnum))
                    {
                        check = true;
                    }
                }

                if (wFM_Status.Equals(CommonUtils.WIP))
                {
                    if (!mainStatus.Equals(CommonUtils.ResolvedEnum) && !mainStatus.Equals(CommonUtils.WIPEnum) && !mainStatus.Equals(CommonUtils.HoldEnum) && !mainStatus.Equals(CommonUtils.Background_FixEnum))
                    {
                        exMessage += $"you can update one of these status \n - {CRSDataProviderUtils.TranformerStatus(CommonUtils.Resolved)}\n - {CRSDataProviderUtils.TranformerStatus(CommonUtils.Resolved_TemporaryFix)}\n - {CRSDataProviderUtils.TranformerStatus(CommonUtils.Hold)}\n - {CRSDataProviderUtils.TranformerStatus(CommonUtils.Background_Fix)}\nNote: The value in parentheses is SubStatus.";
                        check = true;
                    }
                }

                if (wFM_Status.Equals(CommonUtils.Hold) || wFM_Status.Equals(CommonUtils.Background_Fix) || wFM_Status.Equals(CommonUtils.Resolved_TemporaryFix))
                {
                    var pass = false;
                    if (wFM_Status.Equals(CommonUtils.Hold))
                    {
                        if (!mainStatus.Equals(CommonUtils.HoldEnum)) { pass = true; }
                    }
                    else if (wFM_Status.Equals(CommonUtils.Background_Fix))
                    {
                        if (!mainStatus.Equals(CommonUtils.Background_FixEnum)) { pass = true; }
                    }
                    else if (wFM_Status.Equals(CommonUtils.Resolved_TemporaryFix))
                    {
                        if (mainStatus.Equals(CommonUtils.HoldEnum) || mainStatus.Equals(CommonUtils.Background_FixEnum) 
                            || mainStatus.Equals(CommonUtils.CancelledEnum) || mainStatus.Equals(CommonUtils.AssignedEnum)
                            || mainStatus.Equals(CommonUtils.To_Be_CancelledEnum))
                            pass = true;
                        else if(mainStatus.Equals(CommonUtils.ResolvedEnum))
                            if (!subStatus.Equals(CommonUtils.TemporaryFixEnum)) { pass = true; }
                        else pass = false;
                    }

                    if ( pass && !mainStatus.Equals(CommonUtils.WIPEnum))
                    {
                        exMessage += $"you can update status '{CRSDataProviderUtils.TranformerStatus(CommonUtils.WIP)}'.";
                        check = true;
                    }
                }
            }
            
            if (check)
            {
                throw new AlreadyExistingStatusException(LoggingEnum.SCS0007, exMessage);
            }
            return true;
        }
    }
}
