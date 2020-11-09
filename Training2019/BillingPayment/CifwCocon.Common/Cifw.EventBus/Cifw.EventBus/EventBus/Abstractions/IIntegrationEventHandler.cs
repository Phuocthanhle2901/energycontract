using Cifw.EventBus.Events;
using System.Threading.Tasks;

namespace Cifw.EventBus.Abstractions
{
    public interface IIntegrationEventHandler<in TIntegrationEvent> : IIntegrationEventHandler
        where TIntegrationEvent : IntegrationEvent
    {
        void Handle(TIntegrationEvent @event);
    }

    public interface IIntegrationEventHandler
    {
    }
}
