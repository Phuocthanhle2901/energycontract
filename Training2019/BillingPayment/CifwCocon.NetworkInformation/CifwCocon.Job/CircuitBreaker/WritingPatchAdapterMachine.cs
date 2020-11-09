using IFD.Logging;
using Cifw.Core.Patterns.CircuitBreaker;
using Microsoft.Extensions.Configuration;


namespace WritePatchJob.CircuitBreaker
{
    public class WritingPatchAdapterMachine: AdapterMachine
    {
        public WritingPatchAdapterMachine(ILogger logger, IConfiguration config): base(logger, config)
        {

        }
    }
}
