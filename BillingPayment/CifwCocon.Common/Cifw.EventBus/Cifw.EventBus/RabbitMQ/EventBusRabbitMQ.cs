using System;
using System.Text;
using Cifw.EventBus.Abstractions;
using Cifw.EventBus.Events;
using System.Collections.Generic;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using RabbitMQ.Client.Exceptions;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;
using Autofac;
using Polly.Retry;
using System.Net.Sockets;
using Polly;
using System.Reflection;
using Cifw.EventBus.Exceptions;
using IFD.Logging;

namespace Cifw.EventBus.RabbitMQ
{
    public class EventBusRabbitMQ : IEventBus, IDisposable
    {
        private IConfiguration _config;
        private readonly ILogger _logger;
        private readonly IRabbitMQPersistentConnection _persistentConnection;
        private IModel _consumerChannel;
        private readonly IEventBusSubscriptionsManager _subsManager;
        private readonly ILifetimeScope _autofac;
        private readonly string AUTOFAC_SCOPE_NAME = "cif_event_bus";
        private readonly int _retryCount;

        public EventBusRabbitMQ(IRabbitMQPersistentConnection persistentConnection, ILogger logger, IConfiguration config,
               ILifetimeScope autofac, IEventBusSubscriptionsManager subsManager, int retryCount = 5)
        {
            _config = config;
            _persistentConnection = persistentConnection ?? throw new ArgumentNullException(nameof(persistentConnection));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _subsManager = subsManager ?? new InMemoryEventBusSubscriptionsManager();
            _consumerChannel = CreateConsumerChannel();
            _autofac = autofac;
            _retryCount = retryCount;
            _subsManager.OnEventRemoved += SubsManager_OnEventRemoved;
        }

        private void SubsManager_OnEventRemoved(object sender, string eventName)
        {
            if (!_persistentConnection.IsConnected)
            {
                _logger.Debug("SubsManager_OnEventRemoved: RabbitMq server connection was closed");
                _persistentConnection.TryConnect();
            }

            using (var channel = _persistentConnection.CreateModel())
            {
                channel.QueueUnbind(queue: _config["QueueName"],
                    exchange: _config["ExchangeName"],
                    routingKey: eventName);

                if (_subsManager.IsEmpty)
                {
                    _consumerChannel.Close();
                }
            }
        }

        public void Subscribe<T, TH>()
        where T : IntegrationEvent
        where TH : IIntegrationEventHandler<T>
        {
            var eventName = _subsManager.GetEventKey<T>();
            DoInternalSubscription(eventName);
            _subsManager.AddSubscription<T, TH>();
        }

        private void DoInternalSubscription(string eventName)
        {
            var containsKey = _subsManager.HasSubscriptionsForEvent(eventName);
            if (!containsKey)
            {
                if (!_persistentConnection.IsConnected)
                {
                    _logger.Debug("Publish: RabbitMq server connection was closed");
                    _persistentConnection.TryConnect();
                }

                using (var channel = _persistentConnection.CreateModel())
                {
                    channel.QueueBind(queue: _config["QueueName"],
                                      exchange: _config["ExchangeName"],
                                      routingKey: eventName);
                }
            }
        }

        public void Unsubscribe<T, TH>()
            where TH : IIntegrationEventHandler<T>
            where T : IntegrationEvent
        {
            _subsManager.RemoveSubscription<T, TH>();
        }

        public void Dispose()
        {
            _logger.Info("Disposing bus connection");
            if (_consumerChannel != null)
            {
                _consumerChannel.Dispose();
            }

            if (_persistentConnection != null)
            {
                _persistentConnection.Dispose();
            }

            _subsManager.Clear();
            _logger.Info("Disposed bus connection");
        }

        public void Publish(IntegrationEvent @event, string queueName)
        {
            if (!_persistentConnection.IsConnected)
            {
                _logger.Debug("Publish: RabbitMq server connection was closed");
                _persistentConnection.TryConnect();
            }

            var policy = RetryPolicy.Handle<BrokerUnreachableException>()
                .Or<SocketException>()
                .WaitAndRetry(_retryCount, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)), (ex, time) =>
                {
                    _logger.Warn("RabbitMQ client could not handle successfully", ex);
                });

            using (var channel = _persistentConnection.CreateModel())
            {
                var eventName = @event.GetType().Name;
                channel.ExchangeDeclare(exchange: _config["ExchangeName"], type: "direct", durable: true);
                if (!string.IsNullOrEmpty(queueName))
                {
                    channel.QueueDeclare(queue: queueName,
                                 durable: true,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null);

                    channel.QueueBind(queue: queueName,
                                    exchange: _config["ExchangeName"],
                                    routingKey: eventName);
                }
                else
                {
                    channel.QueueDeclare(queue: _config["QueueName"],
                                 durable: true,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null);

                    channel.QueueBind(queue: _config["QueueName"],
                                 exchange: _config["ExchangeName"],
                                 routingKey: eventName);
                }

                var message = JsonConvert.SerializeObject(@event);
                var body = Encoding.UTF8.GetBytes(message);

                policy.Execute(() =>
                {
                    var properties = channel.CreateBasicProperties();
                    properties.DeliveryMode = 2; // persistent

                    channel.BasicPublish(exchange: _config["ExchangeName"],
                                     routingKey: eventName,
                                     mandatory: true,
                                     basicProperties: properties,
                                     body: body);
                });
            }
        }

        private void PublishQueueRetry(string eventName, BasicDeliverEventArgs ea)
        {
            if (!_persistentConnection.IsConnected)
            {
                _logger.Debug("PublishQueueRetry: RabbitMq server connection was closed");
                _persistentConnection.TryConnect();
            }

            var policy = RetryPolicy.Handle<BrokerUnreachableException>()
                .Or<SocketException>()
                .WaitAndRetry(_retryCount, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)), (ex, time) =>
                {
                    _logger.Warn("RabbitMQ client could not handle successfully", ex);
                });

            using (var _retryConsumerChannel = _persistentConnection.CreateModel())
            {
                var queueArgs = new Dictionary<string, object> {
                            { "x-dead-letter-exchange", _config["ExchangeName"] },
                            { "x-message-ttl", int.Parse(_config["TimeWaitRetry"]) }
                        };
                _retryConsumerChannel.ExchangeDeclare(_config["ExchangeNameRetry"], "direct", durable: true);
                _retryConsumerChannel.QueueDeclare(_config["QueueNameRetry"], true, false, false, queueArgs);
                _retryConsumerChannel.QueueBind(_config["QueueNameRetry"], _config["ExchangeNameRetry"], eventName);

                policy.Execute(() =>
                {
                    var properties = _retryConsumerChannel.CreateBasicProperties();
                    properties.DeliveryMode = 2; // persistent
                    properties.Persistent = true;
                    var body = ea.Body;
                    _retryConsumerChannel.BasicPublish(exchange: _config["ExchangeNameRetry"],
                                    routingKey: eventName,
                                    mandatory: true,
                                    basicProperties: properties,
                                    body: body);
                });
            }
        }

        private IModel CreateConsumerChannel()
        {
            if (!_persistentConnection.IsConnected)
            {
                _logger.Debug("CreateConsumerChannel: RabbitMq server connection was closed");
                _persistentConnection.TryConnect();
            }

            var channel = _persistentConnection.CreateModel();

            channel.ExchangeDeclare(exchange: _config["ExchangeName"],
                                 type: "direct", durable: true);

            channel.QueueDeclare(queue: _config["QueueName"],
                                 durable: true,
                                 exclusive: false,
                                 autoDelete: false,
                                 arguments: null);


            var consumer = new EventingBasicConsumer(channel);
            consumer.Received += async (model, ea) =>
            {
                var eventName = ea.RoutingKey;
                var message = Encoding.UTF8.GetString(ea.Body);

                try
                { 

                ProcessEvent(eventName, message);

                channel.BasicAck(ea.DeliveryTag, multiple: false);
                }
                catch (TargetInvocationException ex)
                {
                    EventBusRabbitMQException rabbitEx = null;
                    try
                    {
                        rabbitEx = ex.InnerException as EventBusRabbitMQException;
                    }
                    catch
                    {

                    }
                    if (rabbitEx.FailureAction == Enums.RabbitMQEnum.RabbitFailureAction.Retry)
                    {
                        channel.BasicAck(ea.DeliveryTag, multiple: false);
                        PublishQueueRetry(eventName, ea);
                        return;
                    }

                    if (rabbitEx.FailureAction == Enums.RabbitMQEnum.RabbitFailureAction.NoRetry)
                    {
                        channel.BasicAck(ea.DeliveryTag, multiple: false);
                        return;
                    }

                    throw;
                }
            };

            channel.BasicConsume(queue: _config["QueueName"],
                                 autoAck: false,
                                 consumer: consumer);

            channel.CallbackException += (sender, ea) =>
            {
                _logger.Info("channel.CallbackException: going to dispose and recreate");
                _consumerChannel.Dispose();
                _consumerChannel = CreateConsumerChannel();
            };

            channel.ModelShutdown += (sender, ea) =>
            {
                _logger.Info("channel.ModelShutdown: going to dispose and recreate");
                _consumerChannel.Dispose();
                _consumerChannel = CreateConsumerChannel();
            };

            return channel;
        }

        private void ProcessEvent(string eventName, string message)
        {
            if (_subsManager.HasSubscriptionsForEvent(eventName))
            {
                using (var scope = _autofac.BeginLifetimeScope(AUTOFAC_SCOPE_NAME))
                {
                    var subscriptions = _subsManager.GetHandlersForEvent(eventName);
                    foreach (var subscription in subscriptions)
                    {
                        var eventType = _subsManager.GetEventTypeByName(eventName);
                        var integrationEvent = JsonConvert.DeserializeObject(message, eventType);
                        var handler = scope.ResolveOptional(subscription.HandlerType);
                        var concreteType = typeof(IIntegrationEventHandler<>).MakeGenericType(eventType);
                        concreteType.GetMethod("Handle").Invoke(handler, new object[] { integrationEvent });
                    }
                }
            }
        }
    }
}
