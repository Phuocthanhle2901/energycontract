using System.Threading;
using System.Threading.Tasks;
using CifwCocon.ImportBiz;
using Microsoft.Extensions.Hosting;

namespace CifwCocon.Billing.App
{
    internal class BillingHostedService : IHostedService
    {
        private readonly IApplicationLifetime _appLifetime;
        private readonly IBillingBiz _billingBiz;
        public BillingHostedService(IApplicationLifetime appLifetime, IBillingBiz billingBiz)
        {
            _appLifetime = appLifetime;
            _billingBiz = billingBiz;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _billingBiz.Sync();
            _appLifetime.StopApplication();
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}
