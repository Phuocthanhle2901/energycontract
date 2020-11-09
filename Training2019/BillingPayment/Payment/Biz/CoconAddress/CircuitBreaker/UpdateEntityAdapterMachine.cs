using Cifw.Core.Logging;
using Cifw.Core.Patterns.CircuitBreaker;
using Microsoft.Extensions.Configuration;

namespace Payment.Biz.CircuitBreaker
{
    public class UpdateEntityAdapterMachine : AdapterMachine
    {
        public UpdateEntityAdapterMachine(ILogger logger, IConfiguration config) : base(logger, config)
        {

        }
    }
}
