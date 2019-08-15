using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net.Http;
using System.ServiceModel;
using System.Threading.Tasks;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using AutoMapper;
using Cifw.Core.CorrelationLoggingMiddleware;
using Common.Exceptions;
using CRSTranformer;
using CRSTranformer.Utils;
using CSRAdapter;
using IFD.Logging;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Polly;
using Polly.Wrap;
using styx2_crs_send.Core;
using styx2_crs_send.Midderwares;
using Swashbuckle.AspNetCore.Swagger;
using WmsClient;

namespace styx2_crs_send
{
    [ExcludeFromCodeCoverage]
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
            services.AddMvc(filters =>
            {
                filters.Filters.Add(typeof(Filters));
            }).SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddRouting(routeOptions => routeOptions.LowercaseUrls = true);
            //auto load any mapper class what inherited Profile. No need to define any things else for mapper.
            services.AddAutoMapper();
            services.Configure<ApiBehaviorOptions>(options => { options.SuppressModelStateInvalidFilter = true; });

            //Configuration data
            services.AddSingleton<ILogger, Log4NetAdapter>();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "Api", Version = "v1" });
            });

            var logger = services.BuildServiceProvider().GetRequiredService<ILogger>();


            var httpClient = new HttpClient()
            {
                BaseAddress = new Uri(Configuration["RestAPIServerBaseUri"])
            };
            services.AddTransient<IAssuranceWmsClient, AssuranceWmsClient>(sp => new AssuranceWmsClient(httpClient, (Log4NetAdapter)logger));

            // initialize services of CRS Adapter
            CRSServiceCollection.AddCSRService(services, Configuration, logger);
            CRSTranformerCollection.AddCSRTranformer(services);

            // acquire services
            var serviceProvider = services.BuildServiceProvider();
            var tranformer = services.BuildServiceProvider().GetRequiredService<ITranformer>();


            var assuranceService = services.BuildServiceProvider().GetRequiredService<IAssuranceWmsClient>();

            var tranformerUtils = services.BuildServiceProvider().GetRequiredService<ITranformerUtils>();

            CRSAdapterServiceCollectionUtils.InitializeServices(services, Configuration, (Log4NetAdapter)logger, tranformer, assuranceService, tranformerUtils);


            services.AddTransient<HttpClient>();

            // intialize CB and Retry
            this.InitializeRetryAndCircuteBreaker(services, serviceProvider.GetRequiredService<ILogger>(), Configuration);

            var container = new ContainerBuilder();
            container.Populate(services);
            return new AutofacServiceProvider(container.Build());
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            //middlewares
            app.UseMiddleware(typeof(ExceptionHandler));

            var pathBase = Configuration["BaseUrl"] ?? string.Empty;
            if (!string.IsNullOrEmpty(pathBase))
            {
                app.UsePathBase(pathBase);
            }
            app.UseSwagger().UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint($"{ (!string.IsNullOrEmpty(pathBase) ? pathBase : string.Empty) }/swagger/v1/swagger.json", "Api");
            });
            app.UseHttpsRedirection();

            app.UseMvc();

            // use middle to get X-Request-Id attribute generated from nginx gateway
            app.UseMiddleware<RequestResponseLoggingMiddleware>();

        }

        /// <summary>
        /// For ticket https://infodation.atlassian.net/browse/CSNA-412, this method will initialize Retry And Circuit breaker for Styx2-CRS-Send service.
        /// </summary>
        /// <param name="serviceCollection"></param>
        /// <param name="logger"></param>
        /// <param name="configuration"></param>
        private void InitializeRetryAndCircuteBreaker(IServiceCollection serviceCollection, ILogger logger, IConfiguration configuration)
        {
            // define actions for each states

            // and keep circuit broken for the specified duration,
            // calling an action on change of circuit state.
            Action<Exception, TimeSpan> onBreak = (exception, timespan) =>
            {
                logger.LogException(LoggingEnum.SCS0101);
                throw exception;
            };

            // Define action for circuit breaker at close state.
            Action onReset = () =>
            {
                // circuit breaker is at close state.
                logger.LogException(LoggingEnum.SCS0102);
            };

            // Define action for circuit breaker at half-open state 
            Action onHalfOpen = () =>
            {
                // circuit breaker is at close state.
                logger.LogException(LoggingEnum.SCS0103);
            };

            // define action for retry
            Action<Exception, int> onRetry = (ex, retryCount) =>
            {
                logger.Info($"CRS-Sender retries to connect to CRS Service. Retry on exception: {ex.Message}");
            };

            // define circuit breaker of polly
            var circuitBreaker = Policy.Handle<Exception>()
                .Or<WcfFailedCommunicationException>()
                .OrInner<ProtocolException>() // failed commnunication exception
                .OrInner<CommunicationException>() // failed commnunication exception
                .OrInner<AggregateException>() // failed commnunication exception
               .CircuitBreaker(

                   exceptionsAllowedBeforeBreaking: int.Parse(configuration["ExceptionsAllowedBeforeBreaking"]),

                   durationOfBreak: TimeSpan.FromSeconds(int.Parse(configuration["DurationOfBreak"])),

                   onBreak,

                   onReset,

                   onHalfOpen);

            // define retry of polly
            var retry = Policy.Handle<Exception>()
                .Or<WcfFailedCommunicationException>()
                .OrInner<ProtocolException>() // failed commnunication exception
                .OrInner<CommunicationException>() // failed commnunication exception
                .OrInner<AggregateException>() // failed commnunication exception
                .Retry(int.Parse(configuration["RetryCount"]), onRetry);

            // define Policy Wrap
            var policyWrap = Policy.Wrap(circuitBreaker, retry);

            // we just need a singleton circuit breaker
            serviceCollection.AddSingleton<PolicyWrap>(sp => { return policyWrap; });
        }
    }
}
