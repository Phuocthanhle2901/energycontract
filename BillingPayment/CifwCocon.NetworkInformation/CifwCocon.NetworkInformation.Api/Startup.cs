using System;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Cifw.EventBus;
using Cifw.EventBus.RabbitMQ;
using Cifw.EventBus.Abstractions;
using Cifw.Core.Patterns.Retry;
using CifwCocon.Entities.Models;
using CifwCocon.NetworkInformation.Biz;
using CifwCocon.NetworkInformation.Biz.CircuitBreaker;
using CifwCocon.NetworkInformation.Bo.IntegrationEvents.Events;
using CifwCocon.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Swashbuckle.AspNetCore.Swagger;
using WritePatchJob.CircuitBreaker;
using WritePatchJob.IntegrationEvents.Handlers;
using Cifw.Mapper;
using RabbitMQ.Client;
using Cifw.Mapper.WritePatch;
using Cifw.Core.CorrelationLoggingMiddleware;
using IFD.Logging;
using CifwCocon.NetworkInformation.Biz.Notification;
using CifwCocon.Utility;
using System.Threading;
using StackExchange.Redis;
using IFD.Mailling;

namespace CifwCocon.NetworkInformation.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            services.AddMemoryCache();
            services.AddEmailService();
            //Mapper
            var configAutomapper = new AutoMapper.MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new AddressMapper());
                cfg.AddProfile(new FiberMapper());
                cfg.AddProfile(new ChangePortQueueMapper());
                cfg.AddProfile(new FiberCleanMapper());
                cfg.AddProfile(new AddressCacheMapper());
                #region Mappper WritePatch Biz
                cfg.AddProfile(new WritePatchIntegrationEventMapper());
                cfg.AddProfile(new UpdateLocalCacheByPatchIntegrationEventMapper());
                #endregion
            });

            var mapper = configAutomapper.CreateMapper();
            services.AddSingleton(mapper);
            services.AddMvc()
            .AddJsonOptions(options =>
            {
                options.SerializerSettings.ContractResolver
                    = new Newtonsoft.Json.Serialization.DefaultContractResolver();
            });
            //Redis

            services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(Configuration["Data:redis:connection"]));

            //Log4net
            services.AddSingleton<ILogger, Log4NetAdapter>();

            //Swagger
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "CifwCocon.NetworkInformation.Api", Version = "v1" });
            });

            //Data
            services.AddDbContext<CifwCocon2018Context>
            (options =>
                options.UseSqlServer(Configuration["Data:CifwCocon2018Context:ConnectionString"]), ServiceLifetime.Transient, ServiceLifetime.Transient
            );

            services.AddSingleton<IRabbitMQPersistentConnection>(sp =>
            {
                var logger = sp.GetRequiredService<ILogger>();

                var factory = new ConnectionFactory()
                {
                    HostName = Configuration["EventBusHost"],
                    Port = int.Parse(Configuration["EventBusPort"])
                };

                if (!string.IsNullOrEmpty(Configuration["EventBusUserName"]))
                {
                    factory.UserName = Configuration["EventBusUserName"];
                }

                if (!string.IsNullOrEmpty(Configuration["EventBusPassword"]))
                {
                    factory.Password = Configuration["EventBusPassword"];
                }

                var retryCount = 5;
                if (!string.IsNullOrEmpty(Configuration["EventBusRetryCount"]))
                {
                    retryCount = int.Parse(Configuration["EventBusRetryCount"]);
                }
                return new DefaultRabbitMQPersistentConnection(factory, logger, retryCount);
            });
            //RabbitMQ client
            RegisterEventBus(services);
            services.AddTransient<UnitOfWork>();

            //Biz
            #region Biz           
            services.AddSingleton<GettingCabinetAdapterMachine>();
            services.AddSingleton<WritingPatchAdapterMachine>();
            services.AddTransient<RetryMachine>();
            services.AddTransient<CoconNetworkBiz>();
            services.AddTransient<CoconConfigurationBiz>();
            services.AddTransient<WritePatchBiz>();
            services.AddTransient<OrderCoconBiz>();
            services.AddTransient<IInfrastructureOverrideService, InfrastructureOverrideService>();
            services.AddScoped<CoconAddressBiz>();
            services.AddTransient<NotificationClient>();
            services.AddSingleton<INotificationService, NotificationService>();
            #endregion   

            var container = new ContainerBuilder();
            container.Populate(services);


            int minWorkerThread, minCompletionPortThread, maxWorkerThread, maxCompletionPortThread;

            ILogger internalLogger = new Log4NetAdapter();

            ThreadPool.GetMinThreads(out minWorkerThread, out minCompletionPortThread);
            ThreadPool.GetMinThreads(out maxWorkerThread, out maxCompletionPortThread);

            internalLogger.Info($"Default MinWorkerThread: {minWorkerThread}");
            internalLogger.Info($"Default MinCompletionPortThread: {minCompletionPortThread}");
            internalLogger.Info($"Default MaxWorkerThread: {maxWorkerThread}");
            internalLogger.Info($"Default MaxCompletionPortThread: {maxCompletionPortThread}");

            var isAppliedCustomPool = Configuration.GetValue<bool>("OverrideThreadPool:IsApplied");

            if (isAppliedCustomPool)
            {
                minWorkerThread = Configuration.GetValue<int>("OverrideThreadPool:MinWorkerThread");
                minCompletionPortThread = Configuration.GetValue<int>("OverrideThreadPool:MinCompletionPortThread");
                maxWorkerThread = Configuration.GetValue<int>("OverrideThreadPool:MaxWorkerThread");
                maxCompletionPortThread = Configuration.GetValue<int>("OverrideThreadPool:MaxCompletionPortThread");
                ThreadPool.SetMinThreads(minWorkerThread, minCompletionPortThread);
                ThreadPool.SetMaxThreads(maxWorkerThread, maxCompletionPortThread);
                internalLogger.Info($"Changed MinWorkerThread: {minWorkerThread}");
                internalLogger.Info($"Changed MinCompletionPortThread: {minCompletionPortThread}");
                internalLogger.Info($"Changed MaxWorkerThread: {maxWorkerThread}");
                internalLogger.Info($"Changed MaxCompletionPortThreads: {maxCompletionPortThread}");
            }

            return new AutofacServiceProvider(container.Build());
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, IApplicationLifetime lifetime, IServiceProvider container)
        {
            try
            {
                if (env.IsDevelopment())
                {
                    app.UseDeveloperExceptionPage();
                }

                app.UseMiddleware<RequestResponseLoggingMiddleware>();

                var pathBase = Configuration["BASE_URL"] ?? string.Empty;

                if (!string.IsNullOrEmpty(pathBase))
                {
                    app.UsePathBase(pathBase);
                }

                app.UseSwagger()
                 .UseSwaggerUI(c =>
                 {
                     c.SwaggerEndpoint($"{ (!string.IsNullOrEmpty(pathBase) ? pathBase : string.Empty) }/swagger/v1/swagger.json", "CifwCocon.NetworkInformation.Api");
                 });

                app.UseMvc(routes =>
                {
                    routes.MapRoute("default", "{controller=Home}/{action=Index}/{id?}");
                });

                ConfigureEventBus(app);
            }
            catch (Exception ex)
            {
                ILogger logger = new Log4NetAdapter();
                logger.Error("Exception in Configure for api", ex);
            }
        }

        private void RegisterEventBus(IServiceCollection services)
        {
            services.AddSingleton<IEventBus, EventBusRabbitMQ>(sp =>
            {
                var rabbitMQPersistentConnection = sp.GetRequiredService<IRabbitMQPersistentConnection>();
                var iLifetimeScope = sp.GetRequiredService<ILifetimeScope>();
                var logger = sp.GetRequiredService<ILogger>();
                var iConfig = sp.GetRequiredService<IConfiguration>();
                var eventBusSubcriptionsManager = sp.GetRequiredService<IEventBusSubscriptionsManager>();

                var retryCount = 5;
                if (!string.IsNullOrEmpty(Configuration["EventBusRetryCount"]))
                {
                    retryCount = int.Parse(Configuration["EventBusRetryCount"]);
                }

                return new EventBusRabbitMQ(rabbitMQPersistentConnection, logger, iConfig, iLifetimeScope, eventBusSubcriptionsManager, retryCount);
            });

            services.AddSingleton<IEventBusSubscriptionsManager, InMemoryEventBusSubscriptionsManager>();
            services.AddTransient<WritePatchIntegrationEventHandler>();
        }

        private void ConfigureEventBus(IApplicationBuilder app)
        {
            var eventBus = app.ApplicationServices.GetRequiredService<IEventBus>();
            eventBus.Subscribe<WritePatchIntegrationEvent, WritePatchIntegrationEventHandler>();
        }
    }
}
