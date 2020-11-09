using System;
using System.Collections.Generic;
using System.Text;

namespace CifwCocon.Utility
{
    public class SettingException : Exception
    {
        public SettingException(string message) : base(message) { }
        public SettingException(string message, Exception inner) : base(message, inner) { }
    }
}
