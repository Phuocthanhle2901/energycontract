using Common.Exceptions;
using IFD.Logging;
using Microsoft.Extensions.Configuration;
using Polly;
using Polly.Wrap;
using styx2_crs_send.Core;
using System;
using System.Collections.Generic;
using System.ServiceModel;
using System.Text;

namespace CRS_Sender.Test.ModelsForTest
{
    /// <summary>
    /// Util class to generate essitial testing data for testing project
    /// </summary>
    public static class TestPolicyUtils
    {
        /// <summary>
        /// For ticket https://infodation.atlassian.net/browse/CSNA-412, this method will initialize Retry And Circuit breaker for Styx2-CRS-Send service.
        /// </summary>
        /// <param name="serviceCollection">service collection object to manage dependency of service.</param>
        /// <param name="logger">logger to write state of circuit breaker for tracking.</param>
        /// <param name="configuration">IConfiguration to get metadata for Retry and Circuit breaker</param>
        public static PolicyWrap InitializeRetryAndCircuteBreaker(ILogger logger, IConfiguration configuration)
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
            return Policy.Wrap(circuitBreaker, retry);

        }
    }
}
