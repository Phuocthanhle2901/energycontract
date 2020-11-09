using Common.Exceptions;
using Common.Models;
using CRSReference;
using CRSTranformer;
using IFD.Logging;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RateLimit.Exception;
using styx2_crs_send.Core;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.Threading.Tasks;

namespace styx2_crs_send.Handle
{
    public interface ICRSClient
    {
        searchOneResponse Search(TaskModel TaskModel);
        ResultFn UpdateTicket(TaskModel TaskModel);
    }
    public class CRSClient : ICRSClient
    {
        // Fallback retry when we failed to parse configuration data.
        private static readonly int FALLBACK_RETRIES = 4;

        private readonly TicketService _ticketService;
        private readonly ITranformer _tranformer;
        private readonly ILogger _logger;
        private readonly IConfiguration _configuration;
        private readonly ICheckRequest _checkRequest;
        private int _numberOfRetryCount { get; set; }
        public CRSClient(TicketService ticketService, ITranformer tranformer, ILogger logger, IConfiguration configuration, ICheckRequest checkRequest)
        {
            _ticketService = ticketService;
            _tranformer = tranformer;
            _logger = logger;
            _configuration = configuration;
            _checkRequest = checkRequest;
            if (int.TryParse(_configuration["PollRetry"], out int temp)) { _numberOfRetryCount = temp; } else { _numberOfRetryCount = FALLBACK_RETRIES; }
        }

        public ResultFn UpdateTicket(TaskModel TaskModel)
        {
            try
            {
                _checkRequest.CheckSource(TaskModel);
                _checkRequest.CheckEnumStatus(TaskModel.Status.MainStatus, TaskModel.Status.SubStatus);
                _checkRequest.CheckValue(TaskModel.Prio3.DomainPermission, "DomainPermission", CRSDataProviderUtils.GetListDomainPermission());
                _checkRequest.CheckValue(TaskModel.Planned.Period, "Period", CRSDataProviderUtils.GetListPlanPeriodsType());
                foreach(var aff in TaskModel.Prio3.Affected)
                {
                    _checkRequest.CheckValue(aff.Department.Name, "Name of Department", CRSDataProviderUtils.GetListDepartment());
                }
                _checkRequest.CheckValue(TaskModel.Prio3.NetworkType, "NetworkType", CRSDataProviderUtils.GetListNetworkType());
                _checkRequest.CheckValue(TaskModel.Prio3.FiberCode, "FiberCode", CRSDataProviderUtils.GetListFiberCode());

                _logger.Info(string.Format("The request had: {0}", JsonConvert.SerializeObject(TaskModel)));
                var schemaVersion = _configuration["SchemaVersion"];
                var tags = CRSDataProviderUtils.setLogAdditional(TaskModel, schemaVersion, _configuration["environment"]);
                _logger.SetAdditionalCorrelations(tags);

                var crsResult = Search(TaskModel);
                _checkRequest.checkStatusBeforeUpdate(crsResult, TaskModel);

                var updateTaskOne = _tranformer.TransformToCRS(TaskModel, crsResult);

                var result = _ticketService.updateOneAsync(updateTaskOne).Result;

                if (result.@return)
                {
                    _logger.LogException(LoggingEnum.SCS0003, message: $"Update Status of TaskId {updateTaskOne.Ticket_Nummer} to '{updateTaskOne.WFM_status}' successfully.");
                }
                else
                {
                    throw new IllegalDataInTaskException(LoggingEnum.SCS0004, message: $"CRS task update with TicketRef {TaskModel.TicketRef} failed. Task locked in backend system?");
                }

                return new ResultFn(CommonEnum.ResultFn.Ok);
            }
            catch (Exception ex)
            {
                var message = ex.InnerException?.Message ?? ex.Message;
                
                if(ex is NullReferenceException)
                {
                    throw new HandleFailedException(LoggingEnum.SCS0004, message: $"CRS task update with TicketRef {TaskModel.TicketRef} failed by exception: {message}");
                }
                if (ex is AggregateException || ex is ProtocolException)
                {
                    throw new WcfFailedCommunicationException(LoggingEnum.SCS0012, $"Failed to run updateOneAsync caused by exception: {message}");
                }
                throw ex;
            }
        }

        public searchOneResponse Search(TaskModel TaskModel)
        {
            Exception throwedEx = null;
            int retryCount = 0;
            do
            {
                try
                {
                    var crsResult = _ticketService.searchOneAsync(CRSDataProviderUtils.SearchOneRequest(TaskModel)).Result;
                    if (crsResult == null || crsResult.@return.Length == 0)
                    {
                        throw new OperationWithNoResultException(LoggingEnum.SCS0011, "Request to CRS service by searchOneAsync method with no result");
                    }
                    return crsResult;
                }
                catch (Exception ex)
                {
                    throwedEx = ex;
                    var message = ex.InnerException?.Message ?? ex.Message;
                    _logger.Warn(message, ex);
                    if (ex.InnerException is FaultException)
                    {
                        throw new OperationWithNoResultException(LoggingEnum.SCS0011, ex.InnerException?.Message ?? ex.Message);
                    }
                    if (CRSDataProviderUtils.isXMlParserException(ex))
                    {
                        retryCount++;
                        _logger.Info($"CRS detected a XML Parser Exception (method searchOne). Retry to search again {retryCount} time(s)");
                    }
                    else if (ex is IOException)
                    {
                        throw new HandleFailedException(LoggingEnum.SCS0010, $"Can't get result from CRS with TicketRef {TaskModel.TicketRef} by exception: {message}");
                    }
                    else if (ex is AggregateException || ex is ProtocolException)
                    {
                        throw new WcfFailedCommunicationException(LoggingEnum.SCS0012, $"Failed to run getTaskByIdAsync with TicketRef {TaskModel.TicketRef} caused by exception: {message}");
                    }
                    else throw ex;
                }
            } while (CRSDataProviderUtils.isXMlParserException(throwedEx) && retryCount <= _numberOfRetryCount);

            throw new LimitException(LoggingEnum.SCS0013, $"Reached retry limit when fetched detail of ticket {TaskModel.TicketRef}. please try again");
        }

    }
}
