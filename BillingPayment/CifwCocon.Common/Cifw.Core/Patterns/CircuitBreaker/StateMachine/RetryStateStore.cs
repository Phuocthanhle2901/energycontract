using System;

namespace Cifw.Core.Patterns.CircuitBreaker.StateMachine
{
    public class RetryStateStore : ICircuitBreakerStateStore
    {
        public bool IsClosed { get { return State == CircuitBreakerState.Close; } }
        protected readonly object HalfOpenSyncObject = new object();
        public Exception LastException { get; set; }
        public DateTime LastStateChangeDateUtc { get; set; }
        public CircuitBreakerState State { get; set; }

        public RetryStateStore()
        {
            State = CircuitBreakerState.Close;
            LastStateChangeDateUtc = DateTime.UtcNow;
        }

        public void HalfOpen()
        {
            State = CircuitBreakerState.HalfOpen;
            LastStateChangeDateUtc = DateTime.UtcNow;
        }

        /// <summary>
        /// Switch Open state
        /// </summary>
        /// <param name="exception"></param>
        public void Trip(Exception exception)
        {
            State = CircuitBreakerState.Open;
            LastException = exception;
            LastStateChangeDateUtc = DateTime.UtcNow;
        }

        public void Reset()
        {
            State = CircuitBreakerState.Close;
            LastException = null;
        }
    }
}
