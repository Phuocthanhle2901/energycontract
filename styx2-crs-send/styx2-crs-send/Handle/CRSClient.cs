using Common.Exceptions;
using Common.Models;
using CRSReference;
using CRSTranformer;
using CSRAdapter;
using IFD.Logging;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Polly.Wrap;
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
        void CleanRequest(TaskModel TaskModel);
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

        // improve for ticket https://infodation.atlassian.net/browse/CSNA-430
        // we use HtppWebRequest (Wrapped by ICRSAdapter) for request SearchOne
        private readonly ICRSAdapter _crsServiceClient;
        public PolicyWrap _policy { get; set; }
        private int _numberOfRetryCount { get; set; }
        public CRSClient(TicketService ticketService, ITranformer tranformer, ILogger logger,
            IConfiguration configuration,
            ICheckRequest checkRequest, 
            PolicyWrap policy,
            ICRSAdapter crsServiceClient)
        {
            _ticketService = ticketService;
            _tranformer = tranformer;
            _logger = logger;
            _configuration = configuration;
            _checkRequest = checkRequest;
            _policy = policy;
            if (int.TryParse(_configuration["PollRetry"], out int temp)) { _numberOfRetryCount = temp; } else { _numberOfRetryCount = FALLBACK_RETRIES; }
            _crsServiceClient = crsServiceClient;
        }

        /// <summary>
        /// From data from WMS service.
        /// We do transfer from WMS data to CRS data (convert json -> xml) and update data to CRS service if the data is valid.
        /// </summary>
        /// <param name="TaskModel">Data of assurance task from WMS service to converted and tranfered to CRS service.</param>
        /// <returns>Result of proccessing flow in ResultFn model.</returns>
        public ResultFn UpdateTicket(TaskModel TaskModel)
        {
            try
            {
                CleanRequest(TaskModel);

                _logger.Info(string.Format("Ticket json request from FlowManager service: {0}", JsonConvert.SerializeObject(TaskModel)));

                var schemaVersion = _configuration["SchemaVersion"];

                var tags = CRSDataProviderUtils.setLogAdditional(TaskModel, schemaVersion, _configuration["environment"]);

                _logger.SetAdditionalCorrelations(tags);

                // get detai of ticket before updating to valid status of this ticket from CRS service.
                var crsResult = _crsServiceClient.SearchOneTraditionalWay(TaskModel.TicketRef);

                //check value search result
                if (crsResult == null)
                    throw new OperationWithNoResultException(LoggingEnum.SCS0011, message: "Request to CRS service by searchOneAsync method returned no result");

                _checkRequest.checkStatusBeforeUpdate(crsResult, TaskModel);

                var updateTaskOne = _tranformer.TransformToCRS(TaskModel, crsResult);

                var result = _policy.Execute(()=> _ticketService.updateOneAsync(updateTaskOne).Result);

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

        /// <summary>
        /// use searchOneAsync for search ticket
        /// </summary>
        /// <param name="TaskModel"></param>
        /// <returns></returns>
        public searchOneResponse Search(TaskModel TaskModel)
        {
            string xmlException = string.Empty;
            Exception throwedEx = null;
            int retryCount = 0;
            do
            {
                try
                {
                    var crsResult = _policy.Execute(() => _ticketService.searchOneAsync(CRSDataProviderUtils.SearchOneRequest(TaskModel)).Result);
                    if (crsResult == null || crsResult.@return.Length == 0)
                    {
                        throw new OperationWithNoResultException(LoggingEnum.SCS0011, "Request to CRS service by searchOneAsync method returned no result");
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
                        xmlException = ex.Message;
                        retryCount++;
                        _logger.Info($"CRS detected a XML Parser Exception (method searchOne). Retry to search again {retryCount} time(s)");
                    }
                    else if (ex is IOException)
                    {
                        throw new HandleFailedException(LoggingEnum.SCS0010, $"Can't get result from CRS with TicketRef {TaskModel.TicketRef} by exception: {message}");
                    }
                    else if (ex is AggregateException || ex is ProtocolException)
                    {
                        throw new WcfFailedCommunicationException(LoggingEnum.SCS0012, $"Failed to run searchOneAsync with TicketRef {TaskModel.TicketRef} caused by exception: {message}");
                    }
                    else throw ex;
                }
            } while (CRSDataProviderUtils.isXMlParserException(throwedEx) && retryCount <= _numberOfRetryCount);

            throw new LimitException(LoggingEnum.SCS0013, $"Reached retry limit when fetched detail of ticket {TaskModel.TicketRef} by exception: {xmlException}. please try again!");
        }

        /// <summary>
        /// Check request value for update
        /// </summary>
        /// <param name="TaskModel"></param>
        public void CleanRequest(TaskModel TaskModel)
        {
            if (string.IsNullOrWhiteSpace(TaskModel.TicketRef))
            {
                TaskModel.TicketRef = TaskModel.ExternalTicketNo;
            }
            _checkRequest.CheckSource(TaskModel);
            _checkRequest.CheckEnumStatus(TaskModel.Status.MainStatus, TaskModel.Status.SubStatus);
            _checkRequest.CheckInputStatusForUpdateFields(TaskModel);
            _checkRequest.CheckValue(TaskModel.Prio3?.DomainPermission, "DomainPermission", CRSDataProviderUtils.GetListDomainPermission());
            _checkRequest.CheckValue(TaskModel.Planned?.Period, "Period", CRSDataProviderUtils.GetListPlanPeriodsType());

            if (TaskModel.Prio3 != null && TaskModel.Prio3?.Affected != null)
            {
                foreach (var aff in TaskModel.Prio3?.Affected)
                {
                    _checkRequest.CheckValue(aff.Department?.Name, "Name of Department", CRSDataProviderUtils.GetListDepartment());
                }
            }

            _checkRequest.CheckValue(TaskModel.Prio3?.NetworkType, "NetworkType", CRSDataProviderUtils.GetListNetworkType());
            _checkRequest.CheckValue(TaskModel.Prio3?.FiberCode, "FiberCode", CRSDataProviderUtils.GetListFiberCode());
        }
    }
}
