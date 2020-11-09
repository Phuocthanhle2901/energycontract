using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using AutoMapper;
using Cifw.Core.CorrelationLoggingMiddleware;
using CRSTranformer;
using IFD.Logging;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using styx2_crs_send.Midderwares;
using Swashbuckle.AspNetCore.Swagger;

namespace styx2_crs_send
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
            
            // initialize services of CRS Adapter
            CRSServiceCollection.AddCSRService(services, Configuration, logger);
            CRSTranformerCollection.AddCSRTranformer(services);

            services.AddTransient<HttpClient>();

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
    }
}
