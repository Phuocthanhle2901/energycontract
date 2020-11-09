using System;

namespace Cifw.Core.Exceptions
{
    public class AdapterMachineException : Exception
    {
        public AdapterMachineException(string message) : base(message) { }
        public AdapterMachineException(string message, Exception inner) : base(message, inner) { }
    }
}
