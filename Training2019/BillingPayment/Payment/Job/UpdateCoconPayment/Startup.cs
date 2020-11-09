using Cifw.Core.Logging;
using Cifw.Core.Patterns.BackgroundService.Configuration;
using Cifw.Core.Mailing;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Payment.Biz;
using Payment.Biz.CircuitBreaker;
using System;
using System.Collections.Generic;
using System.Text;
using Payment.Biz.Interface;
using Cifw.Core.Patterns.Retry;
using CifwCocon.Entities.Models;
using Microsoft.EntityFrameworkCore;
using UpdateCoconPayment.Tasks;
using CifwCocon.Repositories;

namespace UpdateCoconPayment
{
    public class Startup
    {
        public Startup(IHostingEnvironment env, IConfiguration configuration)
        {
            HostingEnvironment = env;
            Configuration = configuration;
        }

        public IHostingEnvironment HostingEnvironment { get; }
        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            //add health check for this service
            //services.AddHealthChecks(checks =>
            //{
            //    var minutes = 1;

            //    if (int.TryParse(Configuration["HealthCheck:Timeout"], out var minutesParsed))
            //    {
            //        minutes = minutesParsed;
            //    }
            //    checks.AddSqlCheck("OrderingDb", Configuration["ConnectionString"], TimeSpan.FromMinutes(minutes));
            //});
            
            services.AddSingleton<Cifw.Core.Logging.ILogger, Log4NetAdapter>();            

            //Data
            services.AddDbContext<CifwCocon2018Context>
            (options =>
                options.UseSqlServer(Configuration["Data:CifwCocon2018Context:ConnectionString"])
            );

            //Biz

            services.AddScoped<UnitOfWork>();
            #region Biz           
            services.AddTransient<IMailing, Mailing>();

            services.AddSingleton<UpdateEntityAdapterMachine>();            

            services.AddTransient<RetryMachine>();

            services.AddTransient<CoconConfigurationBiz>();

            services.AddTransient<IUpdateCoconAddressBiz, UpdateCoconAddressBiz>();
            #endregion

            #region Host job background
            //configure settings
            services.Configure<BackgroundTaskSettings>(Configuration);
            services.AddOptions();

            //configure background task
            services.AddSingleton<IHostedService, UpdateCoconStatusPayment>();
            #endregion 
        }


        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {

#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
            app.Map("/liveness", lapp => lapp.Run(async ctx => ctx.Response.StatusCode = 200));
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
        }        
    }
}
