using IFD.Logging;
using Cifw.Core.Patterns.CircuitBreaker;
using Microsoft.Extensions.Configuration;
using System;
using System.Timers;

namespace CifwCocon.NetworkInformation.Biz.CircuitBreaker
{
    public class GettingCabinetAdapterMachine : AdapterMachine
    {
        private Timer _timmer { get; set; }
        private Action _action { get; set; }
        public GettingCabinetAdapterMachine(ILogger logger, IConfiguration config) : base(logger, config)
        {
        }

        public void RaiseEventToReupdateTechpath(Action action)
        {
            //Minutes
            var timmer = string.IsNullOrWhiteSpace(_config["ReUpdateTechPathTimmer"]) ? 5 : int.Parse(_config["ReUpdateTechPathTimmer"]);
            if (_timmer != null) return;
            _timmer = new Timer(timmer * 60000); // 1 sec = 1000, 60 sec = 60000
            _action = action;
            _timmer.AutoReset = true;
            _timmer.Elapsed += new ElapsedEventHandler(t_Elapsed);
            _timmer.Start();
        }

        private void t_Elapsed(object sender, ElapsedEventArgs e)
        {
            //if(State == Core.Patterns.CircuitBreaker.StateMachine.CircuitBreakerState.Close)
            _action();
        }
    }
}
