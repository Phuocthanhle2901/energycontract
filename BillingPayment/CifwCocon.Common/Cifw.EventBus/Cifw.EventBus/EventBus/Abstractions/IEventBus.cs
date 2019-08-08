using Cifw.EventBus.Abstractions;
using Cifw.EventBus.Events;


namespace Cifw.EventBus.Abstractions
{    
    public interface IEventBus
    {
        void Publish(IntegrationEvent @event, string queueName);

        void Subscribe<T, TH>()
            where T : IntegrationEvent
            where TH : IIntegrationEventHandler<T>;
        
        void Unsubscribe<T, TH>()
            where TH : IIntegrationEventHandler<T>
            where T : IntegrationEvent;
    }
}
