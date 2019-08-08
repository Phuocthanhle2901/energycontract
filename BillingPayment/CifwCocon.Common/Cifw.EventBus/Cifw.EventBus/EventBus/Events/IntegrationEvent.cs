using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Cifw.EventBus.Events
{
    public class IntegrationEvent
    {
        public IntegrationEvent()
        {
            Id = Guid.NewGuid();
            CreationDate = DateTime.UtcNow;
        }
        public string CorrelationId { get; set; }
        public string MessageId { get; set; }

        public string ConsumerMessageId
        {
            get
            {
                var processId = 1;
                if (!string.IsNullOrEmpty(MessageId))
                {
                    var datas = MessageId.Split("-").ToList();
                    if (datas.Count() == 2)
                    {
                        var tryParse = int.TryParse(datas[1], out processId);
                        processId = tryParse ? processId + 1 : 1;
                    }
                    return string.Concat(datas[0], "-", processId);
                }
                else
                {
                    var consumerMessageId = string.IsNullOrEmpty(CorrelationId) ?
                        string.Empty : string.Concat(CorrelationId, "-", processId);
                    return consumerMessageId;
                }
            }
        }
        public Guid Id { get; }
        public DateTime CreationDate { get; }
    }
}
