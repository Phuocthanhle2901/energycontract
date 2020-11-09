using System;
using System.Net.Http;

namespace Service.Exceptions
{
    public class RestfulException : Exception
    {
        public HttpResponseMessage HttpResponseMessage { get; set; }
        public RestfulException(string message, Exception exception): base(message, exception)
        {
            
        }
        public RestfulException(string message) : base(message)
        {
        }
        public RestfulException(HttpResponseMessage httpResponseMessage)
        {
            HttpResponseMessage = httpResponseMessage;
        }
    }
}
