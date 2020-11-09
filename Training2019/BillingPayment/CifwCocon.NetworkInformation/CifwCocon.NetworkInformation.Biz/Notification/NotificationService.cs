using CifwCocon.NetworkInformation.Bo;
using CifwCocon.NetworkInformation.Bo.Notification;
using CifwCocon.Utility;
using IFD.Logging;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CifwCocon.NetworkInformation.Biz.Notification
{
    public class NotificationService:INotificationService
    {
        private readonly ILogger _logger;
        private readonly NotificationClient _notificationClient;

        public NotificationService(ILogger logger, NotificationClient notificationClient)
        {
            _logger = logger;
            _notificationClient = notificationClient;
        }
        public void RequestNotification(int orderId,string templateName,string titleOfNotification, string reason=null, string status=null, string invalid = null, string totalBefore = null)
        {
            try
            {
                var notificationRequest = new NotificationRequest
                {
                    DestinationSystemId = "CIF",
                    DestinationSystemName = "WMS",
                    TemplateName = templateName,
                    TitleOfNotification = titleOfNotification,
                    SetOfTextProperties = new TextProperty[]
                    {
                        !string.IsNullOrWhiteSpace(reason) ? new TextProperty
                        {
                            Key = "{{Reason}}",
                            Value = reason
                        } : null,
                        !string.IsNullOrWhiteSpace(orderId.ToString()) ? new TextProperty
                        {
                            Key = "{{OrderId}}",
                            Value = orderId.ToString()
                        } : null,
                        !string.IsNullOrWhiteSpace(status) ? new TextProperty
                        {
                            Key = "{{Status}}",
                            Value = status
                        } : null,
                        !string.IsNullOrWhiteSpace(invalid) ? new TextProperty
                        {
                            Key = "{{Invalid}}",
                            Value = invalid
                        } : null,
                        !string.IsNullOrWhiteSpace(totalBefore) ? new TextProperty
                        {
                            Key = "{{TotalBefore}}",
                            Value = totalBefore
                        } : null,
                    }
                };

                //Prevent missing correlationId
                var correlationId = _logger.GetCorrelationId();
                _notificationClient.RequestNotification(notificationRequest, correlationId);
            }
            catch (Exception ex)
            {
                 _logger.LogException(BusinessLogicLoggingEnum.BUL0042, ex);
            }
        }
    }
}
