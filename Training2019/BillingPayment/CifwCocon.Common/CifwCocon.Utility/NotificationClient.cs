using CifwCocon.NetworkInformation.Bo;
using CifwCocon.NetworkInformation.Bo.Notification;
using IFD.Logging;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;

namespace CifwCocon.Utility
{
    public class NotificationClient
    {
        private readonly IConfiguration _config;
        private readonly ILogger _logger;

        public NotificationClient(IConfiguration config, ILogger logger)
        {
            _config = config;
            _logger = logger;
        }

        public void RequestNotification(NotificationRequest request, string correlationId)
        {
            var requestInfo = " - Request Notification with param : " +
                                $" - DestinationSystemId : {request.DestinationSystemId} " +
                                $" - DestinationSystemName : {request.DestinationSystemName} " +
                                $" - TemplateName : {request.TemplateName} " +
                                $" - TitleOfNotification : {request.TitleOfNotification} ";
            try
            {
                //Set correaltionid with thread
                _logger.SetCorrelationId(correlationId);

                //Config
                var url = _config["NotificationApi"];
                if (string.IsNullOrWhiteSpace(url))
                {
                      throw new SettingException($"{"NotificationApi"} has not been configured yet");
                }

                //Client
                var client = new HttpClient { BaseAddress = new Uri(url) };
                client.DefaultRequestHeaders.Accept.Clear();
                client.Timeout = TimeSpan.FromSeconds(60);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                //Header
                client.DefaultRequestHeaders.Add("X-Request-ID", correlationId);
                //RequestUri
                var requestUri = url ;
                //Content
                HttpContent content = new StringContent(JsonConvert.SerializeObject(request), Encoding.Unicode, "application/json");
                //Request
                var response = client.PostAsync(requestUri, content).Result;
                if (response.IsSuccessStatusCode && response.StatusCode == System.Net.HttpStatusCode.Created)
                {
                    _logger.LogException(BusinessLogicLoggingEnum.BUL0002, message: $"Request Notification Api sucessfully with request {requestInfo}:");
                    return;
                }
                var errMsg = $"Invalid Notification response - Detail: HTTPCode: {response.StatusCode} Reason: {response.ReasonPhrase}. {requestInfo}";
                    _logger.LogException(BusinessLogicLoggingEnum.BUL0002, message: errMsg);
            }
            catch (AggregateException ex)
            {
                _logger.Error("Timeout exception - Request to Notification Api failed", ex);
            }
            catch (Exception ex)
            {
                _logger.Error("Another exception - Request to Notification Api failed", ex);
            }
        }
    }
}
