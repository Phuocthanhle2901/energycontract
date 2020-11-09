using System;
using System.Collections.Generic;
using System.Text;

namespace Cifw.Core.Exceptions
{
    public class ExternalSystemException : Exception
    {
        public ExternalSystemException(string message) : base(message) { }
        public ExternalSystemException(string message, Exception inner) : base(message, inner) { }
    }
}
