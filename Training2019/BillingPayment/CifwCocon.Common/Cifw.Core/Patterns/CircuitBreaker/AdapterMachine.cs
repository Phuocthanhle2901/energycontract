using Cifw.Core.Exceptions;
using Cifw.Core.Logging;
using Cifw.Core.Patterns.CircuitBreaker.StateMachine;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Cifw.Core.Patterns.CircuitBreaker
{
    public class AdapterMachine : RetryStateStore
    {
        private IConfiguration _config;
        private ILogger _logger;

        public AdapterMachine(ILogger logger, IConfiguration config)
        {
            _config = config;   
            _logger = logger;
        }

        public void SetCorrelationId(string originalCorrelationId)
        {
            if (_logger != null)
            {
                _logger.SetCorrelationId(originalCorrelationId);
            }
        }

        public void SetMessageId(string messageId)
        {
            if (_logger != null)
            {
                _logger.SetMessageId(messageId);
            }
        }

        public void SetAdditionalCorrelations(Dictionary<string, string> keyValues)
        {
            if (_logger != null)
            {
                _logger.SetAdditionalCorrelations(keyValues);
            }
        }

      


        /// <summary>
        /// cbRetry, cbTimeout miliseconds
        /// </summary>
        /// <param name="action"></param>
        /// <param name="cbRetry"></param>
        /// <param name="cbTimeout"></param>
        public void ExcuteAction(Action action, int cbRetry, int cbTimeout)
        {
            //Open
            if (!IsClosed)
            {
                if (LastStateChangeDateUtc.AddMilliseconds(cbRetry) < DateTime.UtcNow)
                {
                    bool lockTaken = false;
                    try
                    {
                        Monitor.TryEnter(HalfOpenSyncObject, ref lockTaken);
                        if (lockTaken)
                        {
                            //Half open
                            HalfOpen();

                            var task = Task.Run(() =>
                            {
                                action();
                            });

                            if (!task.Wait(TimeSpan.FromMilliseconds(cbTimeout)))
                                throw new AdapterMachineException(string.Format("Timeout {0} miliseconds that is configured in Database", cbTimeout));

                            //Successful
                            _logger.Info(string.Format("{0} instance is available again", this.GetType().Name));
                            Reset();
                            return;
                        }
                    }
                    catch (AggregateException ex)
                    {
                        //BusinessException
                        if (typeof(BusinessException).IsInstanceOfType(ex.InnerExceptions[0]))
                        {
                            TrackException(ex);
                            Reset();
                            throw ex.InnerExceptions[0];
                        }

                        TrackException(ex);
                        throw new AdapterMachineException(string.Format("{0} instance is unavailable", this.GetType().Name), ex);
                    }
                    catch (Exception ex)
                    {
                        TrackException(ex);
                        throw new AdapterMachineException(string.Format("{0} instance is unavailable", this.GetType().Name), ex);
                    }
                    finally
                    {
                        if (lockTaken)
                        {
                            Monitor.Exit(HalfOpenSyncObject);
                        }
                    }
                }
                throw new AdapterMachineException(string.Format("{0} instance is fixing. Process will try later", this.GetType().Name), LastException);
            }

            //Close
            try
            {
                var task = Task.Run(() =>
                {
                    action();
                });

                if (!task.Wait(TimeSpan.FromMilliseconds(cbTimeout)))
                    throw new Exception(string.Format("Timeout {0} miliseconds that is configured in Database", cbTimeout));
            }
            catch(AggregateException ex)
            {
                //BusinessException
                if (typeof(BusinessException).IsInstanceOfType(ex.InnerExceptions[0]))
                {              
                    TrackException(ex);
                    Reset();
                    throw ex.InnerExceptions[0];
                }

                TrackException(ex);
                throw new AdapterMachineException(string.Format("{0} instance is unavailable", this.GetType().Name), ex);
            }
            catch (Exception ex)
            {
                TrackException(ex);
                throw new AdapterMachineException(string.Format("{0} instance is unavailable", this.GetType().Name), ex);
            }
        }

        private void TrackException(Exception ex)
        {
            Trip(ex);
        }
    }
}
