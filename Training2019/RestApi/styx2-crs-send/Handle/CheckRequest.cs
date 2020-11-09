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
        bool checkStatusBeforeUpdate(searchOneResponse searchOneResponse, TaskModel TaskModel);
    }
    public class CheckRequest : ICheckRequest
    {
        private readonly IConfiguration _configuration;
        public CheckRequest(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public void CheckSource(TaskModel TaskModel)
        {
            TaskModel.SourceId = TaskModel.SourceId.Trim();
            TaskModel.SourceSystemId = TaskModel.SourceSystemId.Trim();
            if (!TaskModel.SourceId.Equals(_configuration["SourceId"]) || !TaskModel.SourceSystemId.Equals(_configuration["SourceSystemId"]))
            {
                throw new HandleFailedException(LoggingEnum.SCS0006, $"Source({TaskModel.SourceId}/{TaskModel.SourceSystemId}) is invalid.");
            }

            if(TaskModel.Prio3.Priority != 3)
            {
                throw new HandleFailedException(LoggingEnum.SCS0006, $"Priority({TaskModel.Prio3.Priority}) is invalid");
            }
        }

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
                        if(!subStatus.Equals(CommonUtils.CancelOkEnum) && !subStatus.Equals(CommonUtils.CancelExpiredEnum) && !string.IsNullOrWhiteSpace(subStatus))
                        {
                            throw new HandleFailedException(LoggingEnum.SCS0006, $"SubStatus({ subStatus }) is invalid, please input SubStatus '{CommonUtils.CancelOkEnum}', '{CommonUtils.CancelExpiredEnum}' or none SubStatus.");
                        }
                    }
                    else if (mainStatus.Equals(CommonUtils.ResolvedEnum))
                    {
                        if(!subStatus.Equals(CommonUtils.TemporaryFixEnum) && !string.IsNullOrWhiteSpace(subStatus))
                        {
                            throw new HandleFailedException(LoggingEnum.SCS0006, $"SubStatus({ subStatus }) is invalid, please input SubStatus '{CommonUtils.TemporaryFixEnum}' or none SubStatus.");
                        }
                    }
                }
            }
            return true;
        }

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

        public bool checkStatusBeforeUpdate(searchOneResponse searchOneResponse, TaskModel TaskModel)
        {
            var wFM_Status = searchOneResponse.@return[0].WFM_Status;
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
                        exMessage += $"you can update status '{CommonUtils.WIP}'";
                        check = true;
                    }
                }

                if (wFM_Status.Equals(CommonUtils.To_Be_Cancelled))
                {
                    exMessage += $"you can update status '{CommonUtils.Cancel_Effective}' or '{CommonUtils.Cancel_Expired}'.";
                    if (!mainStatus.Equals(CommonUtils.CancelledEnum) && !mainStatus.Equals(CommonUtils.To_Be_CancelledEnum))
                    {
                        check = true;
                    }
                }

                if (wFM_Status.Equals(CommonUtils.WIP))
                {
                    if (!mainStatus.Equals(CommonUtils.ResolvedEnum) && !mainStatus.Equals(CommonUtils.WIPEnum) && !mainStatus.Equals(CommonUtils.HoldEnum) && !mainStatus.Equals(CommonUtils.Background_FixEnum))
                    {
                        exMessage += $"you can update one of these status \n - {CommonUtils.Resolved}\n - {CommonUtils.Resolved_TemporaryFix}\n - {CommonUtils.Hold}\n - {CommonUtils.Background_Fix}";
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
                        if (mainStatus.Equals(CommonUtils.HoldEnum) || mainStatus.Equals(CommonUtils.Background_FixEnum) || mainStatus.Equals(CommonUtils.CancelledEnum) || mainStatus.Equals(CommonUtils.AssignedEnum))
                            pass = true;
                        else if(mainStatus.Equals(CommonUtils.ResolvedEnum))
                            if (!subStatus.Equals(CommonUtils.TemporaryFixEnum)) { pass = true; }
                        else pass = false;
                    }

                    if ( pass && !mainStatus.Equals(CommonUtils.WIPEnum) && !mainStatus.Equals(CommonUtils.To_Be_CancelledEnum))
                    {
                        exMessage += $"you can update status '{CommonUtils.WIP}' or '{CommonUtils.To_Be_Cancelled}'.";
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
