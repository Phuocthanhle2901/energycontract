using System;
using System.Net.Http.Headers;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using AutoMapper;
using Cifw.Core.CorrelationLoggingMiddleware;
using DomainModel.Enum;
using Entities.CoconMapping;
using Entities.Main;
using Entities.Sla;
using IFD.Logging;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Service;
using Service.CoaxNis;
using Service.CoconMapping;
using Service.DeletingOrder;
using Service.OrderSla;
using Swashbuckle.AspNetCore.Swagger;
using Wms.Admin.Api.Exceptions;
using Wms.Admin.Api.Middlewares;
using Wms.Admin.Core.Mapping;
using static DomainModel.Enum.UnroutedEnum;

namespace Wms.Admin.Api
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
            services.AddMvc(filter => filter.Filters.Add(typeof(Filter))).SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            services.Configure<ApiBehaviorOptions>(options => { options.SuppressModelStateInvalidFilter = true; });
            services.AddCors();
            services.AddCors(options => {
                options.AddPolicy("CorsPolicy",
                    builder => builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
            });
            services.AddTransient<IUnroutedOrderService, UnroutedOrderService>();
            services.AddTransient<ISlaService, SlaService>();
            services.AddTransient<IRoutingService, RoutingService>();
            services.AddTransient<IOrderService, OrderService>();
            services.AddSingleton<ILogger, Log4NetAdapter>();
            services.AddTransient<ITerminatedOrderService, TerminatedOrderService>();
            services.AddTransient<ICoconMappingService, CoconMappingService>();
            services.AddTransient<IOrderRedis, OrderRedis>();

            //Data
            services
            .AddDbContext<SlaContext>(
              options =>
              options.UseMySQL(Configuration["Data:SLaContext:ConnectionString"]), ServiceLifetime.Transient, ServiceLifetime.Transient
            )
            .AddUnitOfWork<SlaContext>();

            services.AddDbContext<MainContext>(options =>
               options.UseMySQL(Configuration["Data:MainContext:ConnectionString"]), ServiceLifetime.Transient, ServiceLifetime.Transient)
              .AddUnitOfWork<MainContext>();

            services.AddDbContext<FulfillmentConfigContext>(options =>
               options.UseMySQL(Configuration["Data:FulfillmentConfigContext:ConnectionString"]), ServiceLifetime.Transient, ServiceLifetime.Transient)
              .AddUnitOfWork<FulfillmentConfigContext>();

            //Swagger
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "Wms.Admin.Api", Version = "v1" });
            });

            services.AddHttpClient(UnroutedEnum.HttpClientRegister.RestAPI.ToString(), f =>
            {
                f.BaseAddress = new Uri(Configuration["FlowManagerApi"]);
                f.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            });

            // BeeherderProvider API
            services.AddHttpClient(UnroutedEnum.HttpClientRegister.BeheerderAPI.ToString(), f =>
            {
                f.BaseAddress = new Uri(Configuration["BeheerderProtalApi"]);
                f.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            });

            // HuuderProtals API
            services.AddHttpClient(UnroutedEnum.HttpClientRegister.HuurderAPI.ToString(), f =>
            {
                f.BaseAddress = new Uri(Configuration["HuurderProtalApi"]);
                f.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            });

            // Coax API
            services.AddHttpClient(UnroutedEnum.HttpClientRegister.CoaxAPI.ToString(), f =>
            {
                f.BaseAddress = new Uri(Configuration["nimCoaxUrl"]);
                f.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            });

            // SLA API
            services.AddHttpClient(HttpClientRegister.SlaAPI.ToString(), f =>
            {
                f.BaseAddress = new Uri(Configuration["SlaApi"]);
                f.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            });

            // CPHandling API
            services.AddHttpClient(HttpClientRegister.CPWmsOrderHandlingAPI.ToString(), f =>
            {
                f.BaseAddress = new Uri(Configuration["CpwmsorderhandlingApi"]);
                f.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            });

            // Override API
            services.AddHttpClient(HttpClientRegister.OverrideAPI.ToString(), f =>
            {
                f.BaseAddress = new Uri(Configuration["overrideUrl"]);
                f.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            });

            //Session
            services.AddDistributedMemoryCache();
            services.AddSession(options => {
                options.IdleTimeout = TimeSpan.FromMinutes(10);//You can set Time
            });

            //Mapper
            Mapper.Initialize(cfg =>
            {
                cfg.AddProfile(new SlaModelMapping());
            });

            var configAutomapper = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new SlaModelMapping());
            });
            var mapper = configAutomapper.CreateMapper();
            services.AddSingleton(mapper);

            services.AddAutoMapper();
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
            app.UseSession();
            app.UseHttpsRedirection();
            var pathBase = Configuration["BASE_URL"] ?? string.Empty;
            if (!string.IsNullOrEmpty(pathBase))
            {
                app.UsePathBase(pathBase);
            }
            app.UseSwagger().UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint($"{ (!string.IsNullOrEmpty(pathBase) ? pathBase : string.Empty) }/swagger/v1/swagger.json", "Wms.Admin.Api");
            });
            app.UseHttpsRedirection();
            app.UseCors(
              builder => builder
             .AllowAnyOrigin()
             .AllowAnyMethod()
             .AllowAnyHeader()
             .AllowCredentials()
             );
            app.UseMiddleware(typeof(RequestResponseLoggingMiddleware));
            app.UseMiddleware(typeof(ErrorHandling));
            app.UseMvc();
            app.UseCors("CorsPolicy");
        }
    }
}
