using Cifw.Core.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Cifw.Core.Patterns.Retry
{
    public class RetryMachine
    {
        private readonly ILogger _logger;
        public RetryMachine(ILogger logger)
        {
            _logger = logger;
        }

        public string CorrelationId { get; set; }
        public string MessageId { get; set; }

        public Dictionary<string, string> AdditionalCorrelations { get; set; }


        /// <summary>
        /// delay: miniseconds
        /// </summary>
        /// <param name="action"></param>
        /// <param name="retryCount"></param>
        /// <param name="delay"></param>
        /// <param name="timeOut"></param>
        /// <returns></returns>
        public async Task RetryAsync(Action action, int retryCount, int delay, int timeOut)
        {
            _logger.SetCorrelationId(CorrelationId);
            _logger.SetMessageId(MessageId);
            _logger.SetAdditionalCorrelations(AdditionalCorrelations);
            var currentRetry = 1;
            var delayTime = TimeSpan.FromMilliseconds(delay);
            while (true)
            {
                try
                {
                    var task = Task.Run(action);
                    if (!task.Wait(TimeSpan.FromMilliseconds(timeOut))) throw new Exception($"Request time out. ({timeOut} miliseconds)");
                    break;
                }
                catch (Exception ex)
                {
                    _logger.SetCorrelationId(CorrelationId);
                    _logger.SetMessageId(MessageId);
                    _logger.SetAdditionalCorrelations(AdditionalCorrelations);
                    _logger.Warn($"Retry {currentRetry} time with delay: {delay} miliseconds.");
                    _logger.Warn(ex.Message);
                    currentRetry++;
                    if (currentRetry > retryCount) throw;
                    await Task.Delay(delayTime);
                }
            }
        }
    }
}
