using System;

namespace Cifw.Core.Patterns.CircuitBreaker.StateMachine
{
    public enum CircuitBreakerState
    {
        Close,
        Open,
        HalfOpen
    }    

    interface ICircuitBreakerStateStore
    {
        CircuitBreakerState State { get; }
        Exception LastException { get; }
        DateTime LastStateChangeDateUtc { get; }
        void Trip(Exception action);
        void Reset();
        void HalfOpen();
        bool IsClosed { get; }
    }
}
