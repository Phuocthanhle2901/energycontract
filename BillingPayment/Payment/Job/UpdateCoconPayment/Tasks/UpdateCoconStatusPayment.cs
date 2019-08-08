using Cifw.Core.Logging;
using Cifw.Core.Mailing;
using Cifw.Core.Patterns.BackgroundService;
using Cifw.Core.Patterns.BackgroundService.Configuration;
using Microsoft.Extensions.Options;
using Payment.Biz;
using Payment.Biz.Interface;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace UpdateCoconPayment.Tasks
{
    public class UpdateCoconStatusPayment 
        : BackgroundService
    {
        private readonly ILogger _logger;

        private readonly BackgroundTaskSettings _settings;        

        private IUpdateCoconAddressBiz _updateCoconAddressBiz;
        
        public UpdateCoconStatusPayment(IOptions<BackgroundTaskSettings> settings,                                         
                                         ILogger logger, IUpdateCoconAddressBiz updateCoconAddressBiz)
        {
            _settings = settings?.Value ?? throw new ArgumentNullException(nameof(settings));            

            _logger = logger ?? throw new ArgumentNullException(nameof(logger));

            _updateCoconAddressBiz = updateCoconAddressBiz;            
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.Debug($"UpdateCoconPayment is starting.");

            stoppingToken.Register(() => _logger.Debug($"#1 UpdateCoconPayment background task is stopping."));
            
            _updateCoconAddressBiz.UpdateCoconAddressForStatusPayment();

            _logger.Debug($"UpdateCoconPayment background task is stopping.");

            await Task.CompletedTask;            
        }        
    }
}
