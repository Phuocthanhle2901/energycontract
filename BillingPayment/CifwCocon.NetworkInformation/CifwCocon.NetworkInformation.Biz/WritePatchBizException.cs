using Cifw.Core.Exceptions;
using System;
using System.Collections.Generic;
using System.Text;

namespace CifwCocon.NetworkInformation.Biz
{
    public class WritePatchBizException : BusinessException
    {
        public WritePatchBizException(string message) : base(message) { }
        public WritePatchBizException(string message, Exception inner) : base(message, inner) { }
    }
}