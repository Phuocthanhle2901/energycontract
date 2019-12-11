using Common.DomainModel.Base;
using Common.Exceptions;
using Common.Models;
using IFD.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using RateLimit.Exception;
using styx2_crs_send.Core;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Task = System.Threading.Tasks.Task;

namespace styx2_crs_send.Midderwares
{
    public class ExceptionHandler
    {
        private readonly RequestDelegate _requestDelegate;
        private readonly ILogger _logger;
        private readonly IConfiguration _configuration;

        public ExceptionHandler(RequestDelegate requestDelegate, ILogger logger, IConfiguration configuration)
        {
            _requestDelegate = requestDelegate;
            _logger = logger;
            _configuration = configuration;
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
            finally
            {
                _logger.ResetAdditionalCorrelations();
            }
        }
        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            var ticketRef = GetTicketRef(context);
            dynamic resultException = new ExpandoObject();
            var code = CommonEnum.Default;
            switch (exception)
            {
                case HandleFailedException handleFailedException:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    resultException.ticketRef = ticketRef;
                    code = handleFailedException.Code ?? code;
                    resultException.result = new ResultBusiness
                    {
                        Code = code.ToString(),
                        Text = exception.InnerException?.Message ?? exception.Message
                    };
                    _logger.LogException(handleFailedException.LogObject, message: exception.InnerException?.Message ?? exception.Message);
                    await context.Response.WriteAsync(Newtonsoft.Json.JsonConvert.SerializeObject((object)resultException));
                    break;
                case AlreadyExistingStatusException alreadyExistingStatusException:
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    resultException.ticketRef = ticketRef;
                    code = alreadyExistingStatusException.Code ?? code;
                    resultException.result = new ResultBusiness
                    {
                        Code = code.ToString(),
                        Text = exception.InnerException?.Message ?? exception.Message
                    };
                    _logger.LogException(alreadyExistingStatusException.LogObject, message: exception.InnerException?.Message ?? exception.Message);
                    await context.Response.WriteAsync(Newtonsoft.Json.JsonConvert.SerializeObject((object)resultException));
                    break;
                case IllegalDataInTaskException illegalDataInTaskException:
                    context.Response.StatusCode = (int)HttpStatusCode.Locked;
                    resultException.ticketRef = ticketRef;
                    code = illegalDataInTaskException.Code ?? code;
                    resultException.result = new ResultBusiness
                    {
                        Code = code.ToString(),
                        Text = exception.InnerException?.Message ?? exception.Message
                    };
                    _logger.LogException(illegalDataInTaskException.LogObject, message: exception.InnerException?.Message ?? exception.Message);
                    await context.Response.WriteAsync(Newtonsoft.Json.JsonConvert.SerializeObject((object)resultException));
                    break;
                case OperationWithNoResultException operationWithNoResultException:
                    context.Response.StatusCode = (int)HttpStatusCode.NoContent;
                    resultException.ticketRef = ticketRef;
                    code = operationWithNoResultException.Code ?? code;
                    resultException.result = new ResultBusiness
                    {
                        Code = code.ToString(),
                        Text = exception.InnerException?.Message ?? exception.Message
                    };
                    _logger.LogException(operationWithNoResultException.LogObject, message: exception.InnerException?.Message ?? exception.Message);
                    await context.Response.WriteAsync(Newtonsoft.Json.JsonConvert.SerializeObject((object)resultException));
                    break;
                case LimitException limitException:
                    context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
                    resultException.ticketRef = ticketRef;
                    code = limitException.Code ?? code;
                    resultException.result = new ResultBusiness
                    {
                        Code = code.ToString(),
                        Text = exception.InnerException?.Message ?? exception.Message
                    };
                    _logger.LogException(limitException.LogObject, message: exception.InnerException?.Message ?? exception.Message);
                    await context.Response.WriteAsync(Newtonsoft.Json.JsonConvert.SerializeObject((object)resultException));
                    break;
                case WcfFailedCommunicationException wcfFailedCommunicationException:
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    resultException.ticketRef = ticketRef;
                    code = wcfFailedCommunicationException.Code ?? code;
                    resultException.result = new ResultBusiness
                    {
                        Code = code.ToString(),
                        Text = exception.InnerException?.Message ?? exception.Message
                    };
                    _logger.LogException(wcfFailedCommunicationException.LogObject, message: exception.InnerException?.Message ?? exception.Message);
                    await context.Response.WriteAsync(Newtonsoft.Json.JsonConvert.SerializeObject((object)resultException));
                    break;
                default:
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    resultException.ticketRef = ticketRef;
                    resultException.result = new ResultBusiness
                    {
                        Code = code.ToString(),
                        Text = exception.Message
                    };
                    _logger.LogException(LoggingEnum.SCS9999, message: exception.Message);
                    await context.Response.WriteAsync(Newtonsoft.Json.JsonConvert.SerializeObject((object)resultException));
                    break;
            }
        }

        private string GetTicketRef(HttpContext context)
        {
            return context.Request.Headers["ticketRef"];
        }
    }
}
