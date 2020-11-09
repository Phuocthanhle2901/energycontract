using System;
using System.Collections.Generic;
using System.Text;

namespace CifwCocon.NetworkInformation.Bo.Notification
{
    public class NotificationRequest
    {
        public string DestinationSystemId { get; set; }
        public string DestinationSystemName { get; set; }
        public string TemplateName { get; set; }
        public string TitleOfNotification { get; set; }
        public TextProperty[] SetOfTextProperties { get; set; }
    }
}
