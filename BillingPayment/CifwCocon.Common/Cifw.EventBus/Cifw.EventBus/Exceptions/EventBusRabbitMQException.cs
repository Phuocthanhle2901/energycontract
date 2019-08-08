using System;
using static Cifw.EventBus.Enums.RabbitMQEnum;

namespace Cifw.EventBus.Exceptions
{
    public class EventBusRabbitMQException : Exception
    {
        public RabbitFailureAction FailureAction { get; }
        public EventBusRabbitMQException(RabbitFailureAction action, string message) : base(message) { FailureAction = action; }
        public EventBusRabbitMQException(RabbitFailureAction action, string message, Exception inner) : base(message, inner) { FailureAction = action; }       
    }
}
