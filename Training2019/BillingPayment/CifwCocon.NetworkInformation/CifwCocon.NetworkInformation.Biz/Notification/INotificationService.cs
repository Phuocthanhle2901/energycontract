using System;
using System.Collections.Generic;
using System.Text;

namespace CifwCocon.NetworkInformation.Biz.Notification
{
    public interface INotificationService
    {
        void RequestNotification(int orderId, string templateName, string titleOfNotification, string reason=null, string status = null, string invalid = null, string totalBefore = null);
    }
}
