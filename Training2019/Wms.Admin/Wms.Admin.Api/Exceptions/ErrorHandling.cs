using IFD.Logging;
using Microsoft.AspNetCore.Http;
using System;
using System.Net;
using System.Threading.Tasks;
using Common;
using Service.Exceptions;

namespace Wms.Admin.Api.Exceptions
{
    public class ErrorHandling
    {
        /// <summary>
        /// Next
        /// </summary>
        private readonly RequestDelegate _requestDelegate;

        private readonly ILogger _logger;

        public ErrorHandling(RequestDelegate requestDelegate, ILogger logger)
        {
            _requestDelegate = requestDelegate;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _requestDelegate(context);
            }
            catch (Exception e)
            {
                await HandleExceptionAsync(context, e);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            var errorMessage = exception.InnerException?.Message ?? exception.Message;
            switch (exception)
            {
                case ArgumentNullException _:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    break;
                case AggregateException _:
                    context.Response.StatusCode = (int)HttpStatusCode.RequestTimeout;
                    break;
                case RestfulException restfulException:
                    context.Response.StatusCode = (int)restfulException.HttpResponseMessage.StatusCode;
                    errorMessage = restfulException.HttpResponseMessage.Content.ReadAsStringAsync().Result;
                    await context.Response.WriteAsync(errorMessage);
                    return;
                default:
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    _logger.LogException(LoggingEnum.UDR9999, exception);
                    break;
            }
            await context.Response.WriteAsync(Newtonsoft.Json.JsonConvert.SerializeObject(new { isError = true, message = errorMessage }));
        }
    }

}
